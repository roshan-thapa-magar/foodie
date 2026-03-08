import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import BagItem from "@/models/BagItem";

interface Params {
  id: string[];
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;

    const bagId = id[0]
    const type = id[1]
    const targetId = id[2]

    await connectMongoDB()

    const bagItem = await BagItem.findById(bagId)

    if (!bagItem) {
      return NextResponse.json(
        { success: false, message: "BagItem not found" },
        { status: 404 }
      )
    }

    // 1️⃣ Delete whole bag item
    if (!type) {
      await BagItem.findByIdAndDelete(bagId)

      return NextResponse.json({
        success: true,
        message: "BagItem deleted successfully",
      })
    }

    // 2️⃣ Delete whole topping group
    if (type === "group") {

      bagItem.toppings = bagItem.toppings.filter(
        (t: any) => t._id.toString() !== targetId
      )

    }

    // 3️⃣ Delete topping item
    if (type === "item") {

      bagItem.toppings = bagItem.toppings.map((topping: any) => {

        topping.items = topping.items.filter(
          (item: any) => item._id.toString() !== targetId
        )

        topping.totalSelectedToppingPrice = topping.items.reduce(
          (sum: number, item: any) => sum + (item.price || 0),
          0
        )

        return topping
      })

      // remove empty groups
      bagItem.toppings = bagItem.toppings.filter(
        (topping: any) => topping.items.length > 0
      )
    }

    // recalc price
    const totalToppings = bagItem.toppings.reduce(
      (sum: number, topping: any) =>
        sum + (topping.totalSelectedToppingPrice || 0),
      0
    )

    bagItem.totalAmount = bagItem.price * bagItem.qty + totalToppings

    await bagItem.save()

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
      data: bagItem,
    })

  } catch (error: unknown) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      { status: 500 }
    )
  }
}


export async function PUT(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const bagId = id[0]; // BagItem ID

    await connectMongoDB();

    const bagItem = await BagItem.findById(bagId);
    if (!bagItem) {
      return NextResponse.json({ success: false, message: "BagItem not found" }, { status: 404 });
    }

    const body = await request.json();
    const { qty } = body;

    if (typeof qty !== "number" || qty <= 0) {
      return NextResponse.json({ success: false, message: "Invalid quantity" }, { status: 400 });
    }

    bagItem.qty = qty;

    // Recalculate totalAmount including toppings
    const totalToppings = bagItem.toppings.reduce(
      (sum: number, topping: any) => sum + (topping.totalSelectedToppingPrice || 0),
      0
    );
    bagItem.totalAmount = bagItem.price * bagItem.qty + totalToppings;

    await bagItem.save();

    return NextResponse.json({
      success: true,
      message: "BagItem quantity updated successfully",
      data: bagItem,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({
      success: false,
      message: "Failed to update BagItem quantity",
      error: errMsg,
    }, { status: 500 });
  }
}


