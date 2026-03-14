import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import BagItem from "@/models/BagItem";
import Order from "@/models/Order";

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

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let imageUrl = user.image; // default to existing

    if (image && image.startsWith("data:image")) {
      // Delete old image from Cloudinary if it exists
      if (user.image) {
        try {
          // Extract public_id from URL (Cloudinary URLs are usually like .../folder/public_id.ext)
          const segments = user.image.split("/");
          const filename = segments[segments.length - 1].split(".")[0];
          const folder = "users";
          await cloudinary.uploader.destroy(`${folder}/${filename}`);
        } catch (err) {
          console.warn("Could not delete old image:", err);
        }
      }

      // Upload new image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "users",
        public_id: id, // use user ID as public_id
        overwrite: true,
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

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT USER ERROR:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
    }

    await connectMongoDB();

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // ✅ Allowed statuses for deletion
    const allowedStatuses = ["pending", "cancelled", "completed"];

    // Check if user has any orders with NOT allowed statuses
    const blockingOrders = await Order.find({ userId: id, status: { $nin: allowedStatuses } });

    if (blockingOrders.length > 0) {
      // Get unique blocking statuses
      const statuses = [...new Set(blockingOrders.map(order => order.status))];
      return NextResponse.json({
        success: false,
        message: `Cannot delete user: you have orders with status ${statuses.join(", ")}`,
      }, { status: 400 });
    }

    // 1️⃣ Delete user's Cloudinary image
    if (user.image) {
      try {
        const segments = user.image.split("/");
        const filename = segments[segments.length - 1].split(".")[0]; // public_id
        const folder = "users";
        await cloudinary.uploader.destroy(`${folder}/${filename}`);
      } catch (err) {
        console.warn("Failed to delete user image from Cloudinary:", err);
      }
    }

    // 2️⃣ Delete all BagItems and their images
    const bagItems = await BagItem.find({ userId: id });
    for (const item of bagItems) {
      if (item.image) {
        try {
          const segments = item.image.split("/");
          const filename = segments[segments.length - 1].split(".")[0]; // public_id
          const folder = "bagitems";
          await cloudinary.uploader.destroy(`${folder}/${filename}`);
        } catch (err) {
          console.warn("Failed to delete bag item image:", err);
        }
      }
    }

    await BagItem.deleteMany({ userId: id }); // Delete all bag items

    // 3️⃣ Delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "User and related items deleted successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ success: false, message: "Server error", error: String(error) }, { status: 500 });
  }
}