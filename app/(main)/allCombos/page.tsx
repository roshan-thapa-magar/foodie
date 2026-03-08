"use client"
import ComboItem from '@/components/ComboItem';
import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react';
import { getItems } from "@/services/items.api";
import SortDropdown from "@/components/SortDropdown";


export default function page() {
  const [sort, setSort] = useState<string>("default");

  const [items, setItems] = useState<any[]>([]);
  console.log(items)
  const fetchComboItems = async () => {
    try {
      const data = await getItems("combo",sort);
      setItems(data); // <-- store the full items array
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
        <span className="text-xl font-extrabold">Combo Meals</span>
        <SortDropdown sort={sort} setSort={setSort} />
      </div>
      <div className="grid custom-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ComboItem key={item._id} item={{ ...item }} className="w-full" />
        ))}
      </div>
    </div>
  )
}
