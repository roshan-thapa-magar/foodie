"use client";

import ComboItem from "@/components/ComboItem";
import SortDropdown from "@/components/SortDropdown";
import FilterSidebar from "./FilterSidebar";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface ComboGridProps {
  items: any[];
  sort: string;
  setSort: (value: string) => void;
  minPrice?: number | "";
  maxPrice?: number | "";
  setMinPrice?: (val: number | "") => void;
  setMaxPrice?: (val: number | "") => void;
  setSelectedCid?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCid?: string[];
}

export default function ComboGrid({
  items,
  sort,
  setSort,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  selectedCid,
  setSelectedCid,
}: ComboGridProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="w-full overflow-y-auto hide-scrollbar space-y-2">
      {/* Sort & Mobile Filter */}
      <div className="flex justify-between items-center">
        {/* Desktop Label */}
        <span className="hidden md:flex font-medium">Sort By</span>

        {/* Sort Dropdown */}
        <SortDropdown sort={sort} setSort={setSort} />

        {/* Mobile Filter Button */}
        <span
          className="md:hidden cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <SlidersHorizontal />
        </span>
      </div>

      {/* Items Grid */}
      <div className="grid custom-grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {items?.length > 0 ? (
          items.map((item) => (
            <ComboItem key={item._id} item={item} className="w-full" />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No items found
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <div className="md:hidden">
        <FilterSidebar
          open={drawerOpen}
          setOpen={setDrawerOpen}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          selectedCid={selectedCid}
          setSelectedCid={setSelectedCid}
        />
      </div>
    </main>
  );
}