"use client";

import { MapPinnedIcon } from "lucide-react";
import { useUser } from "@/context/UserContext"

interface MapButtonProps {
  destination?: string;
  size?: number;
}

export const MapButton: React.FC<MapButtonProps> = ({
  destination = "Jacob unisex salon, Arubari Jorpati Marg, Gokarneshwor 44600",
  size = 20,
}) => {
  const handleClick = () => {
    const encodedDestination = encodeURIComponent(destination);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer"
    >
      <MapPinnedIcon size={size} />
    </div>
  );
};