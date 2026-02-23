import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Category from "@/models/categories";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { categoryName, image } = await request.json();
    console.log(categoryName, image);
    await connectMongoDB();

    // Check if categoryName already exists
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return NextResponse.json(
        { message: "Category Name already exists" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary if provided
    let imageUrl = ""; // default empty string if no image
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "category",
      });
      imageUrl = uploadedImage.secure_url;
    }

    const newCategory = await Category.create({
      categoryName,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create category", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();
    const categories = await Category.find({});
    return NextResponse.json(
      { message: "Categories fetched successfully", categories },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error);
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch categories", error: errMsg },
      { status: 500 }
    );
  }
}