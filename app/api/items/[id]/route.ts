import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Items from "@/models/items";
import cloudinary from "@/lib/cloudinary";

interface Params {
    id: string;
}

export async function GET(request: Request, context: { params: Promise<Params> }) {
    try {
        const { id } = await context.params;
        console.log("Fetching items ID:", id);
        await connectMongoDB();
        const item = await Items.findById(id);
        if (!item) {
            return NextResponse.json(
                { message: "Item not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Item fetched successfully", item },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error(error);
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Failed to fetch item", error: errMsg },
            { status: 500 }
        );
    }
}


export async function DELETE(
  request: Request,
  context: { params: Promise<Params> } // keep the type
) {
  try {
    const { id } = await context.params; // ✅ unwrap the promise

    await connectMongoDB();

    const item = await Items.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (item.image) {
      const imageUrl: string = item.image;
      // Extract public_id for Cloudinary
      const parts = imageUrl.split("/");
      const fileName = parts.pop()?.split(".")[0];
      const folder = parts.pop();
      if (folder && fileName) {
        const publicId = `${folder}/${fileName}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Items.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to delete item", error: errMsg },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<Params> }
) {
  try {
    // ✅ Get the item ID
    const { id } = await context.params;

    await connectMongoDB();

    const item = await Items.findById(id);
    if (!item) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    // ✅ Parse request body
    const body = await request.json();
    const {
      itemType,
      itemName,
      description,
      price,
      category,
      image: newImage,
      toppings,
    } = body;
    console.log(itemType,
      itemName,
      description,
      price,
      category,
      toppings,)

    // ✅ Update image if provided
    if (newImage) {
      let updatedImage = item.image;

      if (item.image) {
        // Extract public_id from existing image
        const parts = item.image.split("/");
        const fileName = parts.pop()?.split(".")[0];
        const folder = parts.pop();
        if (folder && fileName) {
          const publicId = `${folder}/${fileName}`;
          const uploadResponse = await cloudinary.uploader.upload(newImage, {
            public_id: publicId,
            overwrite: true,
            resource_type: "image",
          });
          updatedImage = uploadResponse.secure_url;
        }
      } else {
        // Upload new image if no previous image exists
        const uploadResponse = await cloudinary.uploader.upload(newImage, {
          folder: "item",
        });
        updatedImage = uploadResponse.secure_url;
      }

      item.image = updatedImage;
    }

    // ✅ Update other fields if provided
    if (itemType) item.itemType = itemType;
    if (itemName) item.itemName = itemName;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (category) item.category = category;
    if (toppings) item.toppings = toppings;

    // ✅ Save updated item
    await item.save();

    return NextResponse.json(
      { message: "Item updated successfully", item },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update item", error: errMsg },
      { status: 500 }
    );
  }
}