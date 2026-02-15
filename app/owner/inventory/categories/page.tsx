"use client";

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

// Define the Category type
interface Category {
  sn: number;
  categoryName: string;
  status: string;
  image?: string; // optional image
}

export default function CategoriesPage() {
  // Sample categories
  const initialCategories = useMemo<Category[]>(
    () => [
      { sn: 1, categoryName: "Appetizers", status: "Active", image: "/images/appetizers.png" },
      { sn: 2, categoryName: "Main Courses", status: "Active", image: "/images/main-courses.png" },
      { sn: 3, categoryName: "Desserts", status: "Inactive", image: "/images/desserts.png" },
      { sn: 4, categoryName: "Beverages", status: "Active" },
      { sn: 5, categoryName: "Soups", status: "Active" },
      { sn: 6, categoryName: "Salads", status: "Active" },
      { sn: 7, categoryName: "Breakfast", status: "Inactive" },
      { sn: 8, categoryName: "Lunch", status: "Active" },
      { sn: 9, categoryName: "Dinner", status: "Active" },
      { sn: 10, categoryName: "Snacks", status: "Active" },
      { sn: 11, categoryName: "Kids Menu", status: "Active" },
      { sn: 12, categoryName: "Specials", status: "Inactive" },
      { sn: 13, categoryName: "Vegan Options", status: "Active" },
      { sn: 14, categoryName: "Gluten-Free", status: "Active" },
      { sn: 15, categoryName: "Seasonal", status: "Active" },
    ],
    []
  );

  // Define columns for DataTable
  const columns: ColumnDefinition<Category>[] = useMemo(
    () => [
      { id: "sn", name: "SN" },
      { id: "categoryName", name: "Category Name" },
      {
        id: "image",
        name: "Image",
        render: (category: Category) => (
          <Image
            src={category.image || "https://t4.ftcdn.net/jpg/02/84/46/89/360_F_284468940_1bg6BwgOfjCnE3W0wkMVMVqddJgtMynE.jpg"}
            alt={category.categoryName}
            width={32}
            height={32}
            className="object-cover w-6 h-6 rounded-full"
          />
        ),
      },
      { id: "status", name: "Status" },
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

  // Which columns are visible by default
  const initialColumnVisibility = {
    sn: true,
    categoryName: true,
    image: true,
    status: true,
    action: true,
  };

  const handleAddCategory = () => {
    console.log("Add Category clicked");
    // TODO: Implement add category logic
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
