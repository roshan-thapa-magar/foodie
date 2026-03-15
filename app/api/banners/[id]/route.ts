import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import RestaurantBanner from "@/models/restaurantBannerSchema";
import cloudinary from "@/lib/cloudinary";
declare global {
  var io: import("socket.io").Server;
}
// Next.js 16 expects params as Promise
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET banner by ID
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await connectMongoDB();

    const { id } = await context.params; // await the Promise
    const banner = await RestaurantBanner.findById(id);

    if (!banner) return NextResponse.json({ success: false, message: "Banner not found" });

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

// PUT (update) banner by ID
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await connectMongoDB();

    const { id } = await context.params;
    const { image } = await req.json();

    const banner = await RestaurantBanner.findById(id);
    if (!banner) return NextResponse.json({ success: false, message: "Banner not found" });

    if (image) {
      await cloudinary.uploader.destroy(banner.public_id);
      const upload = await cloudinary.uploader.upload(image, {
        folder: "restaurant/banners",
      });
      banner.url = upload.secure_url;
      banner.public_id = upload.public_id;
    }

    const updateBanner = await banner.save();
    if (global.io) {
      global.io.emit("update", updateBanner);
    }
    return NextResponse.json({ success: true, message: "Banner updated", data: banner });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}

// DELETE banner by ID
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await connectMongoDB();

    const { id } = await context.params;
    const banner = await RestaurantBanner.findById(id);
    if (!banner) return NextResponse.json({ success: false, message: "Banner not found" });

    await cloudinary.uploader.destroy(banner.public_id);
    const deleteBanner = await banner.deleteOne();
    if (global.io) {
      global.io.emit("delete", deleteBanner);
    }

    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}