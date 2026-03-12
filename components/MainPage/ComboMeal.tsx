"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComboItem from "../ComboItem";
import { getItems } from "@/services/items.api";
import { ComboSkeleton } from "@/components/skeleton/ComboSkeleton";

export default function ComboMeal() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComboItems = async () => {
    try {
      const data = await getItems({ itemType: "combo" , sort: "top_selling"});
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch combo items", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComboItems();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <span className="text-2xl font-extrabold">Combo Meals</span>
        <p
          className="font-extrabold text-blue-600 cursor-pointer"
          onClick={() => router.push("/allCombos")}
        >
          See all
        </p>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar space-x-2 md:space-x-4 py-2">
        {loading ? (
          <ComboSkeleton count={5} />
        ) : (
          items.map((item) => (
            <ComboItem
              key={item._id}
              item={{ ...item }}
              className="truncate-text w-[80%] sm:w-1/2 md:w-1/3 lg:w-[23%]"
            />
          ))
        )}
      </div>
    </div>
  );
}