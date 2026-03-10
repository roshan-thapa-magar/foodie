"use client"
import ComboItem from '@/components/ComboItem';
import React, { useEffect, useState } from 'react'
import { getItems } from "@/services/items.api";
import SortDropdown from "@/components/SortDropdown";
import { ComboSkeleton } from "@/components/skeleton/ComboSkeleton";

export default function page() {
  const [items, setItems] = useState<any[]>([]);
  const [sort, setSort] = useState<string>("default");
  const [loading, setLoading] = useState(true);

  const fetchComboItems = async () => {
    setLoading(true);
    try {
      const data = await getItems({
        itemType: "single",
        sort: sort,
      });
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch combo items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComboItems();
  }, [sort]);

  return (
    <div>
      <div className='flex justify-between items-center pb-4'>
        <span className="text-xl font-extrabold">Best Selling Items</span>
        <SortDropdown sort={sort} setSort={setSort} />
      </div>

      <div className="grid custom-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {loading 
          ? <ComboSkeleton count={8} /> 
          : items.map((item) => (
              <ComboItem key={item._id} item={{ ...item }} className="w-full" />
            ))
        }
      </div>
    </div>
  )
}