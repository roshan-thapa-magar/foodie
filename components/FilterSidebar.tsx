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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

/* -------------------- Categories -------------------- */

const categories = [
  "All Categories","Momo","Chowmein","Pizza","Burger",
  "Fried Rice","Pasta","Sandwich","Soup","Snacks",
  "Drinks","Dessert","BBQ","Salad","Rolls","Thukpa",
  "Sekuwa","Noodles","Biryani","Ice Cream","Coffee",
  "Tea","Juice","Smoothie",
];

interface FilterSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/* -------------------- Reusable Category List -------------------- */

function CategoryList({ prefix }: { prefix: string }) {
  return (
    <FieldGroup className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar !gap-2 !p-0">
      {categories.map((item, index) => {
        const checkboxId = `${prefix}-category-${index}`;

        return (
          <Field
            key={checkboxId}
            orientation="horizontal"
            className="flex items-center gap-2"
          >
            <Checkbox id={checkboxId} name={checkboxId} />

            <FieldLabel htmlFor={checkboxId}>
              {item}
            </FieldLabel>
          </Field>
        );
      })}
    </FieldGroup>
  );
}

/* -------------------- Main Sidebar -------------------- */

export default function FilterSidebar({ open, setOpen }: FilterSidebarProps) {
  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden lg:block w-64 h-full">
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

          {/* Categories */}
          <CategoryList prefix="desktop" />

          {/* Price Filter */}
          <div className="border-t mt-4 pt-4">
            <span className="font-medium block mb-2">Prices (Rs.)</span>

            <div className="flex items-center gap-2">
              <Input placeholder="Min" />
              <span>:</span>
              <Input placeholder="Max" />
            </div>
          </div>

        </div>
      </div>

      {/* ================= MOBILE DRAWER ================= */}
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

          {/* Categories */}
          <div className="p-4 overflow-y-auto">
            <CategoryList prefix="mobile" />
          </div>

          {/* Price Filter */}
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