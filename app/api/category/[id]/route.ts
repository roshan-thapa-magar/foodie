import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import BagItem from "@/models/BagItem";

interface Params {
  id: string;
}


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;

    const bagId = id[0];        // BagItem ID
    const toppingItemId = id[1]; // topping item ID

    await connectMongoDB();

    const bagItem = await BagItem.findById(bagId);

    if (!bagItem) {
      return NextResponse.json(
        { message: "BagItem not found" },
        { status: 404 }
      );
    }

    // ✅ Delete topping item
    if (toppingItemId) {
      bagItem.toppings.forEach((topping: any) => {
        topping.items = topping.items.filter(
          (item: any) => item._id.toString() !== toppingItemId
        );
      });

      await bagItem.save();

      return NextResponse.json(
        { message: "Topping item deleted successfully", data: bagItem },
        { status: 200 }
      );
    }

    // ✅ Delete whole bag item
    await BagItem.findByIdAndDelete(bagId);

    return NextResponse.json(
      { message: "BagItem deleted successfully" },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error(error);

    const errMsg = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { message: "Failed to delete BagItem", error: errMsg },
      { status: 500 }
    );
  }
}