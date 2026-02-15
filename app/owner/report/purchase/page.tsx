"use client";

import { useMemo } from "react";
import DataTable, { type ColumnDefinition } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
interface Purchase {
  sn: number;
  date: string;
  supplier: string;
  item: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  billImage: string;
}

export default function PurchasesPage() {
  const initialPurchases = useMemo(
    () => [
      {
        sn: 1,
        date: "2023-07-20",
        supplier: "Tech Solutions Inc.",
        item: "Laptop",
        category: "Electronics",
        quantity: 2,
        unitPrice: 1200.0,
        totalPrice: 2400.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 2,
        date: "2023-07-19",
        supplier: "Office Supplies Co.",
        item: "Printer",
        category: "Office Equipment",
        quantity: 1,
        unitPrice: 350.0,
        totalPrice: 350.0,
        paymentMethod: "Bank Transfer",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 3,
        date: "2023-07-18",
        supplier: "Furniture World",
        item: "Office Chair",
        category: "Furniture",
        quantity: 5,
        unitPrice: 150.0,
        totalPrice: 750.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 4,
        date: "2023-07-17",
        supplier: "Software Hub",
        item: "Software License",
        category: "Software",
        quantity: 10,
        unitPrice: 50.0,
        totalPrice: 500.0,
        paymentMethod: "Online Payment",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 5,
        date: "2023-07-16",
        supplier: "Hardware Depot",
        item: "External Hard Drive",
        category: "Electronics",
        quantity: 3,
        unitPrice: 80.0,
        totalPrice: 240.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 6,
        date: "2023-07-15",
        supplier: "Stationery Mart",
        item: "Notebooks",
        category: "Office Supplies",
        quantity: 20,
        unitPrice: 5.0,
        totalPrice: 100.0,
        paymentMethod: "Cash",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 7,
        date: "2023-07-14",
        supplier: "Cleaning Solutions",
        item: "Cleaning Supplies",
        category: "Maintenance",
        quantity: 1,
        unitPrice: 75.0,
        totalPrice: 75.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 8,
        date: "2023-07-13",
        supplier: "Food Distributors",
        item: "Coffee Beans",
        category: "Pantry",
        quantity: 4,
        unitPrice: 25.0,
        totalPrice: 100.0,
        paymentMethod: "Bank Transfer",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 9,
        date: "2023-07-12",
        supplier: "Tech Solutions Inc.",
        item: "Monitor",
        category: "Electronics",
        quantity: 3,
        unitPrice: 250.0,
        totalPrice: 750.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 10,
        date: "2023-07-11",
        supplier: "Office Supplies Co.",
        item: "Pens",
        category: "Office Supplies",
        quantity: 50,
        unitPrice: 1.0,
        totalPrice: 50.0,
        paymentMethod: "Cash",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 11,
        date: "2023-07-10",
        supplier: "Furniture World",
        item: "Desk Lamp",
        category: "Furniture",
        quantity: 8,
        unitPrice: 40.0,
        totalPrice: 320.0,
        paymentMethod: "Online Payment",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 12,
        date: "2023-07-09",
        supplier: "Software Hub",
        item: "Antivirus Software",
        category: "Software",
        quantity: 1,
        unitPrice: 60.0,
        totalPrice: 60.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 13,
        date: "2023-07-08",
        supplier: "Hardware Depot",
        item: "USB Drive",
        category: "Electronics",
        quantity: 15,
        unitPrice: 10.0,
        totalPrice: 150.0,
        paymentMethod: "Bank Transfer",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 14,
        date: "2023-07-07",
        supplier: "Stationery Mart",
        item: "Stapler",
        category: "Office Supplies",
        quantity: 10,
        unitPrice: 8.0,
        totalPrice: 80.0,
        paymentMethod: "Cash",
        billImage: "/placeholder.svg?height=32&width=32",
      },
      {
        sn: 15,
        date: "2023-07-06",
        supplier: "Cleaning Solutions",
        item: "Hand Sanitizer",
        category: "Maintenance",
        quantity: 20,
        unitPrice: 12.0,
        totalPrice: 240.0,
        paymentMethod: "Credit Card",
        billImage: "/placeholder.svg?height=32&width=32",
      },
    ],
    []
  );

  const columns: ColumnDefinition<Purchase>[] = useMemo(
    () => [
      { id: "sn", name: "SN" },
      { id: "date", name: "Date" },
      { id: "supplier", name: "Supplier" },
      { id: "item", name: "Item" },
      { id: "category", name: "Category" },
      { id: "quantity", name: "Quantity" },
      {
        id: "unitPrice",
        name: "Unit Price",
        render: (purchase: Purchase) => `$${purchase.unitPrice.toFixed(2)}`,
      },
      {
        id: "totalPrice",
        name: "Total Price",
        render: (purchase: Purchase) => `$${purchase.totalPrice.toFixed(2)}`,
      },
      { id: "paymentMethod", name: "Payment Method" },
      {
        id: "billImage",
        name: "Bill Image",
        render: (purchase: Purchase) => (
          <Image
            src={purchase.billImage || "/placeholder.svg"}
            alt={`Bill for ${purchase.item}`}
            width={32}
            height={32}
            className="object-cover rounded-md"
          />
        ),
      },
      {
        id: "action",
        name: "Action",
        align: "center",
        render: (purchase: Purchase) => (
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

  const initialColumnVisibility = {
    sn: true,
    date: true,
    supplier: true,
    item: true,
    category: true,
    quantity: true,
    unitPrice: true,
    totalPrice: true,
    paymentMethod: true,
    billImage: true,
    action: true,
  };

  const handleAddPurchase = () => {
    console.log("Add Purchase clicked");
    // Implement add purchase logic here
  };

  return (
    <DataTable
      data={initialPurchases}
      columns={columns}
      initialColumnVisibility={initialColumnVisibility}
      searchPlaceholder="Search by item..."
      addLabel="Add Purchase"
      onAddClick={handleAddPurchase}
      searchKey="item"
    />
  );
}