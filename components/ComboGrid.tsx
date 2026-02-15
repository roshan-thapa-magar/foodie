"use client";

import ComboItem from "@/components/ComboItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import { useState } from "react";

interface ComboItemType {
  id: number | string;
  image: string;
  title: string;
  price: string | number;
}

interface ComboGridProps {
  items: ComboItemType[];
}

export default function ComboGrid({ items }: ComboGridProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="w-full overflow-y-auto hide-scrollbar space-y-2">
      {/* Sort & Mobile Filter */}
      <div className="flex justify-between items-center">
        <span className="hidden md:flex">Sort By</span>
        <DropdownMenu>
          <DropdownMenuTrigger className="px-3 py-2 border rounded-md">
            <div className="flex items-center gap-4 cursor-pointer">
              <span>Default</span>
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Default</DropdownMenuItem>
            <DropdownMenuItem>High to Low</DropdownMenuItem>
            <DropdownMenuItem>Low to High</DropdownMenuItem>
            <DropdownMenuItem>Popularity</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile filter button */}
        <span
          className="md:hidden cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <SlidersHorizontal />
        </span>
      </div>

      {/* Grid */}
      <div className="grid custom-grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {items.map((item) => (
          <ComboItem key={item.id} item={item} className="w-full" />
        ))}
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden">
        <FilterSidebar open={drawerOpen} setOpen={setDrawerOpen} />
      </div>
    </main>
  );
}
