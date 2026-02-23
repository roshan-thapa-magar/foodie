import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, image } = await request.json();

    await connectMongoDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "user";

    let imageUrl = ""; // default empty string if no image
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "users",
      });
      imageUrl = uploadedImage.secure_url;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      image: imageUrl,
    });

    return NextResponse.json(
      {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
        role: newUser.role,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User creation error:", error);

    // Handle duplicate key error just in case
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
