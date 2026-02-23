import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Category from "@/models/categories";
import cloudinary from "@/lib/cloudinary";

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<Params> } // keep the type
) {
  try {
    // Unwrap params
    const { id } = await context.params;

    console.log("Fetching category ID:", id);

    await connectMongoDB();

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category fetched successfully", category },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch category", error: errMsg },
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (category.image) {
      const imageUrl: string = category.image;
      // Extract public_id for Cloudinary
      const parts = imageUrl.split("/");
      const fileName = parts.pop()?.split(".")[0];
      const folder = parts.pop();
      if (folder && fileName) {
        const publicId = `${folder}/${fileName}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to delete category", error: errMsg },
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

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    const body = await request.json();
    const { categoryName, image: newImage } = body;

    // Update image only if provided
    if (newImage) {
      let updatedImage = category.image;
      if (category.image) {
        // Extract public_id from existing image
        const parts = category.image.split("/");
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
          folder: "category",
        });
        updatedImage = uploadResponse.secure_url;
      }
      category.image = updatedImage;
    }

    // Update categoryName if provided
    if (categoryName) {
      category.categoryName = categoryName;
    }

    category.updatedAt = new Date();
    await category.save();

    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to update category", error: errMsg },
      { status: 500 }
    );
  }
}
