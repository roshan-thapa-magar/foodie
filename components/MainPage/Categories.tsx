'use client'
import Image from "next/image"
import React, { useEffect, useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from "next/navigation"
import { getCategories } from "@/services/category.api";

interface Category {
    _id: string;
    categoryName: string;
    image?: string;
}

export default function Categories() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH ================= */

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    /* ================= UI ================= */

    if (loading) {
        return <div className="mt-4">Loading categories...</div>;
    }
    return (
        <div className="mt-4">
            <span className="text-xl font-extrabold">Categories</span>
            <div className="mt-4 flex overflow-x-auto hide-scrollbar gap-4 cursor-pointer">
                {categories.map((item) => (
                    <div
                        key={item._id}
                        onClick={() => router.push(`/filter/${item._id}`)}
                        className="flex-none w-20 flex flex-col items-center space-y-2 text-center border rounded-lg hover:border-green-500"
                    >
                        <div className="relative h-16 w-16 overflow-hidden rounded-full">
                            <Image
                                src={item.image ||
                                    "https://t4.ftcdn.net/jpg/02/84/46/89/360_F_284468940_1bg6BwgOfjCnE3W0wkMVMVqddJgtMynE.jpg"}
                                alt={item.categoryName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="block w-20 text-center truncate text-sm font-bold leading-tight">
                            {item.categoryName}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
