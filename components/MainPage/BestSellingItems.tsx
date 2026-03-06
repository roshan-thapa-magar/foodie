'use client'
import React, { useEffect, useState } from 'react'
import ComboItem from '../ComboItem';
import { useRouter } from "next/navigation";
import { getItems } from "@/services/items.api";

export default function BestSellingItems() {
      const router = useRouter();
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
        <span className="text-2xl font-extrabold">Best Selling Items</span>
         <p className="font-extrabold text-blue-600 cursor-pointer" onClick={() => router.push("/bestSellingItems")}>
          See all
        </p>
      </div>
      <div className="grid custom-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {items.map((item) => (
                <ComboItem key={item._id} item={{ ...item }}  className="w-full"/>  
              ))}
        </div>
    </div>
  )
}
