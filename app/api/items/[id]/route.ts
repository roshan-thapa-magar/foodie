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
    const { id } = await context.params;

    await connectMongoDB();

    const item = await Items.findById(id);

    if (!item) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    // ✅ Parse FormData
    const formData = await request.formData();

    const itemType = formData.get("itemType") as string;
    const itemName = formData.get("itemName") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = Number(formData.get("price"));
    const toppingsRaw = formData.get("toppings") as string;
    const newImage = formData.get("image") as File | null;

    const toppings = toppingsRaw ? JSON.parse(toppingsRaw) : [];

    console.log(itemType, itemName, description, price, category, toppings);

    // ✅ Replace image if new image provided
    if (newImage && newImage.size > 0) {

      // Delete old image from Cloudinary
      if (item.image) {
        const parts = item.image.split("/");
        const fileName = parts.pop()?.split(".")[0];
        const folder = parts.pop();

        if (folder && fileName) {
          const publicId = `${folder}/${fileName}`;
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Upload new image
      const bytes = await newImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "item" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      item.image = upload.secure_url;
    }

    // ✅ Update fields
    if (itemType) item.itemType = itemType;
    if (itemName) item.itemName = itemName;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (category) item.category = category;
    if (toppings) item.toppings = toppings;

    await item.save();

    return NextResponse.json(
      {
        message: "Item updated successfully",
        item,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);

    const errMsg = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        message: "Failed to update item",
        error: errMsg,
      },
      { status: 500 }
    );
  }
}