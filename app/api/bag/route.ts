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

    // --- Calculate totalSelectedToppingPrice for each topping ---
    const processedToppings = (toppings || []).map((topping: any) => {
      let totalSelectedToppingPrice = 0;

      if (topping.selectionType === "single") {
        const selectedItem = topping.items?.find((i: any) => i.title === topping.selectedItem);
        totalSelectedToppingPrice = selectedItem?.price || 0;
      } else if (topping.selectionType === "multiple") {
        totalSelectedToppingPrice = (topping.items || []).reduce(
          (sum: number, i: any) => sum + (i.price || 0),
          0
        );
      }

      return {
        ...topping,
        totalSelectedToppingPrice,
      };
    });

    // --- Calculate total amount ---
    const totalToppingsPrice = processedToppings.reduce(
      (sum: number, t: any) => sum + (t.totalSelectedToppingPrice || 0),
      0
    );
    const totalAmount = price * (qty || 1) + totalToppingsPrice;

    // --- Store in MongoDB ---
    const newBag = await BagItem.create({
      userId,
      itemId: itemId || null,
      itemName,
      price,
      qty: qty || 1,
      image: image || "",
      note: note || "",
      toppings: processedToppings,
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
    const type = searchParams.get("type") || "bag"; // default to bag

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "UserId is required" },
        { status: 400 }
      );
    }

    const items = await BagItem.find({ userId, type }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch items", error: String(error) },
      { status: 500 }
    );
  }
}