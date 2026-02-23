import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params (Next.js 15+ requirement)
    const { id } = await context.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findById(id).select("-password"); // hide password

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("GET USER ERROR:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    await connectMongoDB();

    const body = await request.json();
    const { name, image, phone, address } = body;

    let imageUrl;

    if (image && image.startsWith("data:image")) {
      // Use user ID as public_id so it replaces the existing image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "users",
        public_id: id,   // ✅ overwrite existing image
        overwrite: true, // ensure replacement
        quality: "auto",
      });
      imageUrl = uploadedImage.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(imageUrl && { image: imageUrl }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT USER ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}