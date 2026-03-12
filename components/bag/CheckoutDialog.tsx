"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

// Dynamic import for Map
const AddressMap = dynamic(
  () =>
    import("@/components/settings/address-map").then((mod) => ({
      default: mod.AddressMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        Loading map...
      </div>
    ),
  }
);

interface CheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (phone: string, paymentMethod: string, address: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ open, onOpenChange, onSubmit }) => {
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screens
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = () => {
    if (!phone) {
      toast.error("Please enter phone number");
      return;
    }
    if (!address) {
      toast.error("Please enter your address");
      return;
    }
    onSubmit(phone, paymentMethod, address);
    onOpenChange(false);
    setPhone("");
    setPaymentMethod("cash");
    setAddress("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser");
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
            toast.success("Current location selected!");
          } else {
            toast.error("Unable to get address from coordinates");
          }
        } catch (err) {
          toast.error("Failed to fetch location address");
        }
      },
      () => {
        toast.error("Failed to get current location");
      }
    );
  };

  // Payment options
  const paymentOptions = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "online", label: "online" },
  ];

  const FormContent = (
    <div className="space-y-4 mt-2">
      {/* Address */}
      <div className="space-y-2">
        {address && (
          <div className="rounded-lg border overflow-hidden mt-2">
            <AddressMap address={address} />
          </div>
        )}
        <label className="text-sm">Address</label>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap"
            onClick={handleUseCurrentLocation}
          >
            Use Current Location
          </Button>
        </div>

        
      </div>
      {/* Phone Number */}
      <div>
        <label className="text-sm">Phone Number</label>
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="text-sm mb-2 block">Payment Method</label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="flex justify-between items-center"
        >
          {paymentOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <label htmlFor={option.value} className="text-sm">
                {option.label}
              </label>
            </div>
          ))}
      
        </RadioGroup>
      </div>


      {/* Submit */}
      <Button className="w-full" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );

  return isMobile ? (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="rounded-t-lg p-4">
        <DrawerHeader>
          <DrawerTitle>Enter Checkout Info</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <div className="overflow-y-auto">
          {FormContent}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Checkout Info</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
            {FormContent}
          </div>
        <DialogClose className="sr-only" />
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;