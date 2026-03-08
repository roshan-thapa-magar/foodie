"use client";

import { useEffect, useState } from "react";
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
import { getCategories } from "@/services/category.api";

interface FilterSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  minPrice: number | "";
  maxPrice: number | "";
  setMinPrice: (val: number | "") => void;
  setMaxPrice: (val: number | "") => void;
}

/* -------------------- Reusable Category List -------------------- */
function CategoryList({ prefix }: { prefix: string }) {
  const [fetchedCategories, setFetchedCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      const data = await getCategories();
      setFetchedCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading categories...</div>;

  return (
    <FieldGroup className="flex-1 overflow-y-auto space-y-3 hide-scrollbar !gap-2 !p-0">
      {fetchedCategories.map((item, index) => {
        const checkboxId = `${prefix}-category-${index}`;
        return (
          <Field
            key={checkboxId}
            orientation="horizontal"
            className="flex items-center gap-2"
          >
            <Checkbox id={checkboxId} name={checkboxId} />
            <FieldLabel htmlFor={checkboxId}>
              {item.categoryName}
            </FieldLabel>
          </Field>
        );
      })}
    </FieldGroup>
  );
}

/* -------------------- Main Sidebar -------------------- */
export default function FilterSidebar({ open, setOpen,minPrice,setMinPrice,maxPrice,setMaxPrice }: FilterSidebarProps) {
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
              <Input
                placeholder="Min"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
              />
              <span>:</span>
              <Input
                placeholder="Max"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
              />
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
              <Input
                placeholder="Min"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
              />
              <span>:</span>
              <Input
                placeholder="Max"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
              />
            </div>
          </div>

        </DrawerContent>
      </Drawer>
    </>
  );
}