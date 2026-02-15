"use client";

import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

interface FoodOrderingDialogProps {
  item: {
    name: string;
    image: string
  };
  children: ReactNode; // Accept any element as trigger
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function FoodOrderingDialog({ item, children }: FoodOrderingDialogProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const sizes = [
    { label: "Small", price: 0 },
    { label: "Medium", price: 50 },
    { label: "Large", price: 100 },
    { label: "Pook", price: 0 },
    { label: "Banana", price: 50 },
  ];

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

const Content = () => (
  <div className="flex flex-col h-full">
    {/* Scrollable content */}
    <div className="overflow-y-auto flex-1 p-4 md:p-0 space-y-4">
      <div>
        <Image
          src={item.image}
          alt={item.name}
          height={100}
          width={100}
          className="w-full h-[30vh] object-cover transition-opacity duration-1000 ease-in-out rounded-lg"
        />
      </div>

      <p className="font-medium">Select Size</p>
      {sizes.map((size) => (
        <div
          key={size.label}
          onClick={() => setSelectedSize(size.label)}
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border ${
            selectedSize === size.label
              ? "border-primary bg-primary/10"
              : "border-border bg-muted/50"
          }`}
        >
          <span className="font-medium">{size.label}</span>
          <span className="text-sm text-muted-foreground">
            {size.price > 0 ? `+¥${size.price}` : "Included"}
          </span>
        </div>
      ))}
    </div>

    {/* Fixed bottom bar */}
    <div className="flex items-center justify-between space-x-4 p-4 border-t bg-background sticky bottom-0 z-50">
      <div className="flex items-center space-x-4 rounded-full">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
          onClick={decrement}
        >
          <Minus />
        </button>
        <span className="text-lg font-semibold min-w-[24px] text-center text-foreground">
          {quantity}
        </span>
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
          onClick={increment}
        >
          <Plus />
        </button>
      </div>
      <Button className="flex-1 py-2">Add to Cart</Button>
    </div>
  </div>
);


  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="h-auto z-[1100]">
          <DrawerHeader>
            <div className="flex justify-between items-center gap-8">
              <DrawerTitle>{item.name}</DrawerTitle>
              <DrawerClose asChild>
                <button>
                  <X />
                </button>
              </DrawerClose>
            </div>
            <DrawerDescription>
              Select size, quantity, and add special instructions
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            Select size, quantity, and add special instructions
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto h-[60vh]">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}
