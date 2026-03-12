import BagItem from "@/models/BagItem";
import Order from "@/models/Order";
import { connectMongoDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

declare global {
  var io: import("socket.io").Server;
}

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const { userId, note, phone, address, paymentMethod } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
    }

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Fetch all bag items for the user
    const bagItems = await BagItem.find({ userId });
    if (!bagItems.length) {
      return new Response(JSON.stringify({ error: "No items in the bag" }), { status: 400 });
    }

    // 4. Calculate total amount
    const totalAmount = bagItems.reduce((sum, item) => sum + item.totalAmount, 0);

    // 5. Create a new order
    const order = new Order({
      userId,
      items: bagItems,
      totalAmount,
      note: note || "",
      phone: phone || "",
      address: address || "",
      paymentMethod: paymentMethod || "cash", // default to cash
      status: "pending",
      paymentStatus: "pending",
    });

    const newOrder = await order.save();

    // 6. Clear the user's bag
    await BagItem.deleteMany({ userId });
    if (global.io) {
      global.io.emit("addOrder", newOrder);
    }

    // 7. Return created order
    return new Response(JSON.stringify({ success: true, order }), { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error.message);
    return new Response(JSON.stringify({ error: error.message || "Failed to create order" }), {
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    let query: any = {};

    if (userId) query.userId = userId;

    // ✅ Multiple status support
    if (status) {
      const statuses = status.split(",");
      query.status = { $in: statuses };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}