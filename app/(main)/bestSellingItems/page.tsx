"use client"
import ComboItem from '@/components/ComboItem';
import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react';
import { getItems } from "@/services/items.api";

export default function page() {
    const [items, setItems] = useState<any[]>([]);
    console.log(items)
    const fetchComboItems = async () => {
      try {
        const data = await getItems("single");
        setItems(data); // <-- store the full items array
      } catch (error) {
        console.error("Failed to fetch combo items", error);
      }
    };
  
    useEffect(() => {
      fetchComboItems();
    }, []);
  return (
    <div>
      <div className='flex justify-between items-center pb-4'>
        <span className="text-xl font-extrabold">Best Selling Items</span>
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
      <div className="grid custom-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {items.map((item) => (
          <ComboItem key={item._id} item={{ ...item }} className="w-full" />
        ))}
      </div>
    </div>
  )
}
