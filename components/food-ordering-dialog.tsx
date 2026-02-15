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
import { Checkbox } from "./ui/checkbox";
import SpicyLevel from "./form/SpicyLevel";
import ToppingSection from "./form/ToppingSection";

interface FoodOrderingDialogProps {
  item: {
    name: string;
    image: string
    price: string | number
    description: string
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
  const vegToppings = [
    { name: "Extra Cheese", price: 150 },
    { name: "Sweet Corn", price: 100 },
    { name: "Olives", price: 120 },
  ]

  const makeItLarge = [
    { name: "Make It Larger 12 inch", price: 150 },
  ]


  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Scrollable content */}
      <div className="overflow-y-auto flex-1 p-4 md:p-0 space-y-2 md:mb-4 hide-scrollbar">
        <div>
          <Image
            src={item.image}
            alt={item.name}
            height={100}
            width={100}
            className="w-full h-[30vh] object-cover transition-opacity duration-1000 ease-in-out rounded-lg"
          />
        </div>

        <p className="font-medium">{item.description}</p>
        <p className="text-xl font-extrabold">Rs. {item.price}</p>
        <div className="space-y-6">
          <ToppingSection title="Extra Toppings For Veg Pizza" items={vegToppings} />
          <ToppingSection title="Make It Large" items={makeItLarge} />
        </div>
        <SpicyLevel />
        <div>

        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="flex items-center justify-between space-x-4 p-4 md:p-0 md:pt-4 border-t bg-background sticky bottom-0 z-50">
        <div className="flex items-center space-x-4 rounded-full">
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
          >
            <Minus />
          </button>
          <span className="text-lg font-semibold min-w-[24px] text-center text-foreground">
            8
          </span>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
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
            {/* <DrawerDescription>
              Select size, quantity, and add special instructions
            </DrawerDescription> */}
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
          {/* <DialogDescription>
            Select size, quantity, and add special instructions
          </DialogDescription> */}
        </DialogHeader>
        <div className="overflow-y-auto h-[60vh]">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}
