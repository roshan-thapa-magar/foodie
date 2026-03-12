// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectMongoDB } from "@/lib/mongodb";

interface Params {
  id: string; // this is userId
}

export async function GET(req: Request, context: { params: Promise<Params> }) {
  try {
    // ✅ Await the params to unwrap
    const { id: userId } = await context.params;
    console.log("Fetching orders for userId:", userId);

    await connectMongoDB();

    // Fetch all orders for this user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Orders fetched successfully", orders },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch orders", error: errMsg },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id: orderId } = await context.params; // here id = orderId
    await connectMongoDB();
    console.log("Deleting orderId:", orderId);

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    await Order.findByIdAndDelete(orderId);

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to delete order", error: errMsg },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id: orderId } = await context.params;
    await connectMongoDB();
    console.log("Updating status for orderId:", orderId);

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { message: `Only pending orders can be cancelled. Current status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update status to cancelled
    order.status = "cancelled";
    await order.save();

    return NextResponse.json(
      { message: "Order status updated to cancelled", order },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update order status", error: errMsg },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request, context: { params: Promise<Params> }) {
  try {
    const { id: orderId } = await context.params;
    await connectMongoDB();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, paymentStatus, paymentMethod } = body;

    // Only update these three fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    await order.save();

    return NextResponse.json(
      { message: "Order updated successfully", order },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update order", error: errMsg },
      { status: 500 }
    );
  }
}