"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { X } from "lucide-react";

const categories = [
  "All Categories", "Momo", "Chowmein", "Pizza", "Burger",
  "Fried Rice", "Pasta", "Sandwich", "Soup", "Snacks",
  "Drinks", "Dessert", "BBQ", "Salad", "Rolls", "Thukpa",
  "Sekuwa", "Noodles", "Biryani", "Ice Cream", "Coffee",
  "Tea", "Juice", "Smoothie",
];

interface FilterSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function FilterSidebar({ open, setOpen }: FilterSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
<div className="hidden lg:block w-64 border-r h-full">
  <div className="flex flex-col h-full">

    {/* Header */}
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-bold">FILTER</span>
      <button
        className="text-sm text-muted-foreground hover:underline"
        onClick={() => setOpen(false)}
      >
        Clear
      </button>
    </div>

    {/* Scrollable Categories ONLY */}
    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
      {categories.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Checkbox />
          <span>{item}</span>
        </div>
      ))}
    </div>

    {/* Fixed Price Filter (NOT scrolling) */}
    <div className="border-t mt-4">
      <span className="font-medium block mb-2">Prices (Rs.)</span>
      <div className="flex items-center gap-2">
        <Input placeholder="Min" />
        <span>:</span>
        <Input placeholder="Max" />
      </div>
    </div>

  </div>
</div>


      {/* Mobile Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[90vh] flex flex-col">

          {/* Header */}
          <DrawerHeader className="border-b">
            <div className="flex justify-between items-center">
              <DrawerTitle>FILTERS</DrawerTitle>
              <DrawerClose asChild>
                <button>
                  <X />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {categories.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Sticky Bottom Price Filter */}
          <div className="border-t p-4 bg-background">
            <span className="font-medium block mb-2">Prices (Rs.)</span>
            <div className="flex items-center gap-2">
              <Input placeholder="Min" />
              <span>:</span>
              <Input placeholder="Max" />
            </div>
          </div>

        </DrawerContent>
      </Drawer>
    </>
  );
}
