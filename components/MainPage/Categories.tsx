'use client'
import Image from "next/image"
import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from "next/navigation"

const categories = [
    { id: 1, image: "/food/image1.png", title: "Momo" },
    { id: 2, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyl5jrFc3LzhI0kHV3SQm5E-FfWIOTW4KReA&s", title: "Thali Meal" },
    { id: 3, image: "https://tkcfoods.com/cdn/shop/products/vegcombo_1080x.png.jpg?v=1626874169", title: "Curries" },
    { id: 4, image: "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg", title: "Wraps" },
    { id: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s", title: "Alcohol and Cigarette" },
    { id: 6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s", title: "Burgers" },
    { id: 7, image: "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg", title: "PROJECT PIZZA" },
    { id: 8, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s", title: "Sekuwa" },
    { id: 9, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s", title: "Keema Noodles" },
    { id: 10, image: "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg", title: "PROJECT PIZZA" },
    { id: 11, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s", title: "Sekuwa" },
    { id: 12, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s", title: "Keema Noodles" },
    { id: 13, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s", title: "Sekuwa" },
    { id: 14, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s", title: "Keema Noodles" },
    { id: 15, image: "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg", title: "PROJECT PIZZA" },
    { id: 16, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s", title: "Sekuwa" },
    { id: 17, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s", title: "Keema Noodles" },
]

export default function Categories() {
    const router = useRouter()
    return (
        <div className="mt-4">
        <span className="text-xl font-extrabold">Categories</span>
            <div className="mt-4 flex overflow-x-auto hide-scrollbar gap-4 cursor-pointer">
            {categories.map((item) => (
                <div
                    key={item.id}
                    onClick={() => router.push(`/filter/${item.id}`)}
                    className="flex-none w-20 flex flex-col items-center space-y-2 text-center border rounded-lg hover:border-green-500"
                >
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="block w-20 text-center truncate text-sm font-bold leading-tight">
                        {item.title}
                    </span>
                </div>
            ))}
        </div>
        </div>
    )
}
