import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Items from "@/models/items";
import cloudinary from "@/lib/cloudinary";
import Category from "@/models/categories";
import Order from "@/models/Order";
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
    const cidParam = searchParams.get("cid"); // multiple category IDs

    let query: any = {};

    // ---------------- Type filter ----------------
    if (type) query.itemType = type;

    // ---------------- Price range filter ----------------
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ---------------- Category filter ----------------
    if (cidParam) {
      const cids = cidParam.split(",");
      const categories = await Category.find({ _id: { $in: cids } }).select("categoryName");
      const categoryNames = categories.map((cat) => cat.categoryName);
      query.category = { $in: categoryNames };
    }

    // ---------------- Sorting ----------------
    if (sort === "popular") {
      // Popular items: based on unique users
      const popularityAggregation = await Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: { itemId: "$items.itemId", userId: "$userId" } } },
        { $group: { _id: "$_id.itemId", userCount: { $sum: 1 } } },
        { $sort: { userCount: -1 } },
      ]);

      const popularityMap: Record<string, number> = {};
      popularityAggregation.forEach((pop) => {
        if (pop._id) popularityMap[pop._id.toString()] = pop.userCount;
      });

      const items = await Items.find(query);
      const itemsWithPopularity = items.map((item) => ({
        ...item.toObject(),
        userCount: popularityMap[item._id.toString()] || 0,
      }));
      itemsWithPopularity.sort((a, b) => b.userCount - a.userCount);

      return NextResponse.json(
        { message: "Items fetched successfully", items: itemsWithPopularity },
        { status: 200 }
      );
    } else if (sort === "top_selling") {
      // Top-selling items: based on total qty sold
      const topSellingAggregation = await Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.itemId", totalSold: { $sum: "$items.qty" } } },
        { $sort: { totalSold: -1 } },
      ]);

      const topSellingMap: Record<string, number> = {};
      topSellingAggregation.forEach((pop) => {
        if (pop._id) topSellingMap[pop._id.toString()] = pop.totalSold;
      });

      const items = await Items.find(query);
      const itemsWithSales = items.map((item) => ({
        ...item.toObject(),
        totalSold: topSellingMap[item._id.toString()] || 0,
      }));
      itemsWithSales.sort((a, b) => b.totalSold - a.totalSold);

      return NextResponse.json(
        { message: "Items fetched successfully", items: itemsWithSales },
        { status: 200 }
      );
    } else {
      // Default sorting: price_low / price_high
      let sortOption: any = {};
      if (sort === "price_low") sortOption = { price: 1 };
      else if (sort === "price_high") sortOption = { price: -1 };

      const items = await Items.find(query).sort(sortOption);
      return NextResponse.json({ message: "Items fetched successfully", items }, { status: 200 });
    }

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