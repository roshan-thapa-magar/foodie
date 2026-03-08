import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import BagItem from "@/models/BagItem";

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();

    const body = await request.json();
    const { userId, itemId, itemName, price, qty, image, note, toppings } = body;

    if (!userId || !itemName || !price) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total topping price
    let totalToppings = 0;
    if (toppings && Array.isArray(toppings)) {
      totalToppings = toppings.reduce((sum: number, topping: any) => {
        return sum + (topping.totalSelectedToppingPrice || 0);
      }, 0);
    }

    const totalAmount = (price * (qty || 1) )+ totalToppings;

    const newBag = await BagItem.create({
      userId,
      itemId: itemId || null,
      itemName,
      price,
      qty: qty || 1,
      image: image || "",
      note: note || "",
      toppings: toppings || [],
      totalAmount,
    });

    return NextResponse.json(
      { success: true, message: "Bag created successfully", data: newBag },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create Bag", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "UserId is required" },
        { status: 400 }
      );
    }

    const bagItems = await BagItem.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      items: bagItems,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch bag items" },
      { status: 500 }
    );
  }
}