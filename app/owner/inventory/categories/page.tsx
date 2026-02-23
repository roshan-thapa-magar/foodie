"use client";
import { useEffect, useState } from "react"

import { useMemo } from "react";
import DataTable, { type ColumnDefinition } from "@/components/data-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

// Category Type
interface Category {
  sn: number;
  categoryName: string;
  image?: string;
}

export default function CategoriesPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true)
  const fetchCategory = async()=>{
    try {
      const res = await fetch(`/api/categories`);
      const data = await res.json();
      if (res.ok) {
        setCategory(data);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to fetch user" };
      }
    } catch (error) {
      
    }
  }
  // Sample Data
  const initialCategories = useMemo<Category[]>(
    () => [
      { sn: 1, categoryName: "Appetizers", image: "/images/appetizers.png" },
      { sn: 2, categoryName: "Main Courses", image: "/images/main-courses.png" },
      { sn: 3, categoryName: "Desserts", image: "/images/desserts.png" },
      { sn: 4, categoryName: "Beverages" },
      { sn: 5, categoryName: "Soups" },
      { sn: 6, categoryName: "Salads" },
      { sn: 7, categoryName: "Breakfast" },
      { sn: 8, categoryName: "Lunch" },
      { sn: 9, categoryName: "Dinner" },
      { sn: 10, categoryName: "Snacks" },
      { sn: 11, categoryName: "Kids Menu" },
      { sn: 12, categoryName: "Specials" },
      { sn: 13, categoryName: "Vegan Options" },
      { sn: 14, categoryName: "Gluten-Free" },
      { sn: 15, categoryName: "Seasonal" },
    ],
    []
  );

  // Table Columns
  const columns: ColumnDefinition<Category>[] = useMemo(
    () => [
      {
        id: "sn",
        name: "SN",
      },
      {
        id: "categoryName",
        name: "Category Name",
      },
      {
        id: "image",
        name: "Image",
        render: (category: Category) => (
          <Image
            src={
              category.image ||
              "https://t4.ftcdn.net/jpg/02/84/46/89/360_F_284468940_1bg6BwgOfjCnE3W0wkMVMVqddJgtMynE.jpg"
            }
            alt={category.categoryName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
        ),
      },
      {
        id: "action",
        name: "Action",
        align: "center",
        render: (category: Category) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500">
                <Trash className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  // Visible Columns
  const initialColumnVisibility = {
    sn: true,
    categoryName: true,
    image: true,
    action: true,
  };

  const handleAddCategory = () => {
    console.log("Add Category clicked");
  };

  return (
    <DataTable
      data={initialCategories}
      columns={columns}
      initialColumnVisibility={initialColumnVisibility}
      searchPlaceholder="Search by category name..."
      addLabel="Add Category"
      onAddClick={handleAddCategory}
      searchKey="categoryName"
    />
  );
}
