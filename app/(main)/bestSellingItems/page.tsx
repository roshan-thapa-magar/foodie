"use client"
import ComboItem from '@/components/ComboItem';
import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react';
import { getItems } from "@/services/items.api";
import SortDropdown from "@/components/SortDropdown";

export default function page() {
    const [items, setItems] = useState<any[]>([]);
      const [sort, setSort] = useState<string>("default");
    
      const fetchComboItems = async () => {
        try {
          const data = await getItems({
            itemType: "single",
            sort: sort,
          });
    
          setItems(data);
        } catch (error) {
          console.error("Failed to fetch combo items", error);
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
        {items.map((item) => (
          <ComboItem key={item._id} item={{ ...item }} className="w-full" />
        ))}
      </div>
    </div>
  )
}
