"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  "/banners/banner1.png",
  "/banners/banner2.png",
  "/banners/banner3.png",
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 50000); // 20 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-md border-2 border-green-500">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Banner"
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
