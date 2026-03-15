"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Make sure you have sonner installed
import { io, Socket } from "socket.io-client";

interface Banner {
  _id: string;
  url: string;
}

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  // Fetch banners from API
  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch banners");
      setBanners(data.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchBanners();
    const socket: Socket = io({
      path: "/socket.io/",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("addBanner", () => {
      fetchBanners();
    });

    socket.on("updateBanner", () => {
      fetchBanners();
    });

    socket.on("update", () => {
      fetchBanners();
    });
    socket.on("delete", () => {
      fetchBanners();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  
  // Automatic slider
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds for demo
    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) {
    return (
      <div className="w-full h-48 md:h-64 lg:h-80 flex items-center justify-center border-2 border-green-500 rounded-md">
        Empty Banner
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden rounded-md border-2 border-green-500">
      {banners.map((banner, i) => (
        <Image
          key={banner._id}
          src={banner.url}
          alt={`Banner ${i + 1}`}
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );
}