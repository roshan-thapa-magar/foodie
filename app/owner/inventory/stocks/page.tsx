"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import DataTable, { ColumnDefinition } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import { ItemForm } from "@/components/Item/itemForm";
import { createItem, deleteItem, getItems, updateItem } from "@/services/items.api";
import { toast } from "sonner";
import { getCategories } from "@/services/category.api";

interface ToppingItem {
  title: string;
  price: number;
}

interface Topping {
  toppingTitle: string;
  selectionType: "single" | "multiple";
  required: boolean;
  items: ToppingItem[];
}

interface Item {
  _id: string;
  itemType: "combo" | "single";
  itemName: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  toppings?: Topping[];
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<
    { _id: string; categoryName: string }[]
  >([]);
  /* ================= FETCH ITEMS ================= */
  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load items");
    }
  };

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmitItem = async (values: any) => {
    try {
      if (editingItem) {
        // UPDATE
        const updated = await updateItem(editingItem._id, values);
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? updated : i))
        );
        toast.success("Item updated successfully");
      } else {
        // CREATE
        const newItem = await createItem(values);
        setItems((prev) => [newItem, ...prev]);
        toast.success("Item created successfully");
      }
      setFormOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save item");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      await deleteItem(selectedItem._id);
      setItems((prev) => prev.filter((i) => i._id !== selectedItem._id));
      toast.success("Item deleted successfully");
      setDeleteOpen(false);
      setSelectedItem(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns: ColumnDefinition<Item>[] = useMemo(
    () => [
      { id: "itemName", name: "Item Name" },
      { id: "itemType", name: "Type" },
      { id: "category", name: "Category" },
      { id: "price", name: "Price", render: (item) => `${item.price}` },
      { id: "description", name: "Description" },
      {
        id: "toppings",
        name: "Toppings",
        render: (item) => item.toppings?.map((t) => t.toppingTitle).join(", ") || "-",
      },
      {
        id: "image",
        name: "Image",
        render: (item) => (
          <Image
            src={item.image || "https://via.placeholder.com/32"}
            alt={item.itemName}
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
        render: (item) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  setEditingItem(item);
                  setFormOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  setSelectedItem(item);
                  setDeleteOpen(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const initialColumnVisibility = {
    itemName: true,
    itemType: true,
    category: true,
    price: true,
    description: true,
    toppings: true,
    image: true,
    action: true,
  };

  return (
    <>
      <DataTable
        data={items}
        columns={columns}
        initialColumnVisibility={initialColumnVisibility}
        searchPlaceholder="Search item..."
        addLabel="Add Item"
        searchKey="itemName"
        onAddClick={() => {
          setEditingItem(null);
          setFormOpen(true);
        }}
      />

      {formOpen && (
        <ItemForm
          title={editingItem ? "Edit Item" : "Add Item"}
          onSubmit={handleSubmitItem}
          onClose={() => {
            setFormOpen(false);
            setEditingItem(null);
          }}
          defaultValues={editingItem || undefined}
          categories={categories}
        />
      )}

      <DeleteDialog
        isOpen={deleteOpen}
        isLoading={isDeleting}
        title="Delete Item?"
        description={`"${selectedItem?.itemName}" will be permanently deleted.`}
        confirmText="Delete Item"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}