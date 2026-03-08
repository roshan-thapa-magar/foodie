import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Items from "@/models/items";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();

    const formData = await request.formData();

    const itemType = formData.get("itemType") as string;
    const itemName = formData.get("itemName") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const price = Number(formData.get("price"));
    const toppingsRaw = formData.get("toppings") as string;
    const imageFile = formData.get("image") as File | null;

    const toppings = toppingsRaw ? JSON.parse(toppingsRaw) : [];

    console.log(itemType, itemName, description, price, category, toppings);

    // Check if item already exists
    const existingItem = await Items.findOne({ itemName });
    if (existingItem) {
      return NextResponse.json(
        { message: "Item Name already exists" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    let imageUrl = "";

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "item" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = upload.secure_url;
    }

    // Create Item
    const newItem = await Items.create({
      itemType,
      itemName,
      description,
      price,
      category,
      image: imageUrl,
      toppings,
    });

    return NextResponse.json(
      {
        message: "Item created successfully",
        item: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);

    const type = searchParams.get("itemType");
    const sort = searchParams.get("sort");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query: any = {};

    // Type filter
    if (type) query.itemType = type;

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort option
    let sortOption: any = {};
    if (sort === "price_low") sortOption = { price: 1 };
    else if (sort === "price_high") sortOption = { price: -1 };
    else if (sort === "popular") sortOption = { ordersCount: -1 }; // ensure schema has this

    const items = await Items.find(query).sort(sortOption);

    return NextResponse.json(
      { message: "Items fetched successfully", items },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Failed to fetch items",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}