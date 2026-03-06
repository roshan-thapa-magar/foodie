"use client";
import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import SpicyLevel from "./form/SpicyLevel";
import ToppingSection from "./form/ToppingSection";

interface FoodOrderingDialogProps {
  item: {
    name: string;
    image: string;
    price: string | number;
    description: string;
    toppings?: {
      toppingTitle: string;
      selectionType: "single" | "multiple";
      required?: boolean;
      items?: { title: string; price: number; _id?: string }[];
    }[];
  };
  children: ReactNode;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);
  return matches;
}

export function FoodOrderingDialog({ item, children }: FoodOrderingDialogProps) {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [quantity, setQuantity] = useState(1);

  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-1 p-4 md:p-0 space-y-2 md:mb-4 hide-scrollbar">
        <Image
          src={item.image}
          alt={item.name}
          height={100}
          width={100}
          className="w-full h-[30vh] object-cover rounded-lg"
        />
        <p className="font-medium">{item.description}</p>
        <p className="text-xl font-extrabold">Rs. {item.price}</p>

        <div className="space-y-4">
          {item.toppings?.map((topping, idx) =>
            topping.selectionType === "multiple" ? (
              <ToppingSection
                key={idx}
                title={topping.toppingTitle}
                items={topping.items || []}
              />
            ) : (
              <SpicyLevel key={idx} title={topping.toppingTitle} items={topping.items || []} />
            )
          )}
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 p-4 md:p-0 md:pt-4 border-t bg-background sticky bottom-0 z-50">
        <div className="flex items-center space-x-4 rounded-full">
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            <Minus />
          </button>
          <span className="text-lg font-semibold min-w-[24px] text-center text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
            onClick={() => setQuantity(q => q + 1)}
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
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>{item.name}</DrawerTitle>
            <DrawerClose asChild>
              <button>
                <X />
              </button>
            </DrawerClose>
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
        </DialogHeader>
        <div className="overflow-y-auto h-[60vh]">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}