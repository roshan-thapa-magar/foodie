"use client";

import { useEffect, useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import ComboGrid from "@/components/ComboGrid";
import { getItems } from "@/services/items.api";
import { getCategories } from "@/services/category.api";

export default function FilterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [sort, setSort] = useState<string>("default");

  const fetchComboItems = async () => {
    try {
      const data = await getItems(undefined, sort); // fetch all items
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch combo items", error);
    }
  };

  // const fetchCategory = async () => {
  //   try {
  //     const data = await getCategories();
  //     setCategories(data);
  //   } catch (error) {
  //     console.error("Failed to fetch categories", error);
  //   }
  // };

useEffect(() => {
  fetchComboItems();
}, [sort]);

  return (
    <div className="flex h-full gap-4">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex border p-4 rounded-md flex-col gap-4">
        <FilterSidebar 
          open={drawerOpen} 
          setOpen={setDrawerOpen} 
          // categories={categories} 
        />
      </aside>

      {/* Grid */}
      <ComboGrid items={items} sort={sort} setSort={setSort} />
    </div>
  );
}