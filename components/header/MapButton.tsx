"use client";

import { MapPinnedIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

export const MapButton: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const { fetchUserByRole } = useUser();
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

  useEffect(() => {
    const loadOwner = async () => {
      const res = await fetchUserByRole("owner");
      if (res.success && res.user?.address) {
        setOwnerAddress(res.user.address);
      }
    };
    loadOwner();
  }, [fetchUserByRole]);

  const handleClick = () => {
    if (!ownerAddress) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      ownerAddress
    )}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <MapPinnedIcon size={size} />
    </div>
  );
};