import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import RestaurantBanner from "@/models/restaurantBannerSchema";
import cloudinary from "@/lib/cloudinary";
declare global {
  var io: import("socket.io").Server;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { image } = await req.json();

    const upload = await cloudinary.uploader.upload(image, {
      folder: "restaurant/banners",
    });

    const banner = await RestaurantBanner.create({
      url: upload.secure_url,
      public_id: upload.public_id,
    });
    if (global.io) {
      global.io.emit("addBanner", banner);
    }

    return NextResponse.json({
      success: true,
      message: "Banner uploaded successfully",
      data: banner,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    // Fetch all banners sorted by order, then by newest first
    const banners = await RestaurantBanner.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: banners,
      message: banners.length ? "Banners fetched successfully" : "No banners found",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectMongoDB();
    const { banners } = await req.json(); // array of { id, order }

    // Update multiple banners in parallel
    const updateBanner = await Promise.all(
      banners.map((b: { id: string; order: number }) =>
        RestaurantBanner.findByIdAndUpdate(b.id, { order: b.order })
      )
    );

    if (global.io) {
      global.io.emit("updateBanner", updateBanner);
    }

    return NextResponse.json({ success: true, message: "Banner order updated" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}