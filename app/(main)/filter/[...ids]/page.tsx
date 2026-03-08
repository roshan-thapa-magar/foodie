"use client";

import { useEffect, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ComboGrid from "@/components/ComboGrid";
import { getItems } from "@/services/items.api";

export default function FilterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("default");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");

const fetchComboItems = async () => {
  try {
    const params: any = { sort };
    if (minPrice !== "") params.minPrice = minPrice;
    if (maxPrice !== "") params.maxPrice = maxPrice;

    const data = await getItems(params);
    setItems(data);
  } catch (error) {
    console.error("Failed to fetch combo items", error);
  }
};

  useEffect(() => {
    fetchComboItems();
  }, [sort, minPrice, maxPrice]);

  return (
    <div className="flex h-full gap-4">
      <aside className="hidden md:flex border p-4 rounded-md flex-col gap-4">
        <FilterSidebar
          open={drawerOpen}
          setOpen={setDrawerOpen}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </aside>

      <ComboGrid items={items} sort={sort} setSort={setSort} />
    </div>
  );
}