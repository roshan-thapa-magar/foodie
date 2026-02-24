import { NextResponse, NextRequest } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Items from "@/models/items";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
    try {
        const { itemType, itemName, description, price, category, image, toppings } = await request.json();
        await connectMongoDB();

        // Check if categoryName already exists
        const existingCategory = await Items.findOne({ itemName });
        if (existingCategory) {
            return NextResponse.json(
                { message: "Items Name already exists" },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary if provided
        let imageUrl = ""; // default empty string if no image
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: "item",
            });
            imageUrl = uploadedImage.secure_url;
        }

        // ✅ Create Item
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
        const items = await Items.find({});
        return NextResponse.json(
            { message: "Items fetched successfully", items },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error(error);
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Failed to fetch items", error: errMsg },
            { status: 500 }
        );
    }
}