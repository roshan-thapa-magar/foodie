"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { useSession } from "next-auth/react";

const AddressMap = dynamic(
  () =>
    import("@/components/settings/address-map").then((mod) => ({
      default: mod.AddressMap,
    })),
  { ssr: false }
);

export default function AddressBook() {
  const { data: session } = useSession();
  const { user, fetchUser, updateUser } = useUser();
  const userId = session?.user?._id;

  const [address, setAddress] = useState("");

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!userId) return;

    if (!address) {
      toast.error("Please enter address");
      return;
    }

    const result = await updateUser(userId, { address });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await res.json();

          if (data?.display_name) {
            setAddress(data.display_name);
            toast.success("Current location selected");
          }
        } catch {
          toast.error("Failed to fetch address");
        }
      },
      () => toast.error("Failed to get location")
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold">Address Book</h1>
          <p className="font-bold">
            Here you can manage all your saved addresses.
          </p>
        </div>
      </div>

      {/* Address Form */}
      <div className="space-y-3 max-w-lg">
        <label className="text-sm font-medium">Address</label>

        <div className="flex gap-2">
          <Input
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Button
            variant="outline"
            onClick={handleUseCurrentLocation}
          >
            Use Current
          </Button>
        </div>

        {/* Map Preview */}
        {address && (
          <div className="border rounded-lg overflow-hidden">
            <AddressMap address={address} />
          </div>
        )}

        <Button onClick={handleUpdate} className="w-full">
          Save Address
        </Button>
      </div>
    </div>
  );
}