"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import DataTable, { ColumnDefinition } from "@/components/data-table";
import FormBuilder, { FormField } from "@/components/form-builder";
import { DeleteDialog } from "@/components/delete-dialog";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, MoreHorizontal, Trash } from "lucide-react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category.api";

/* ================= TYPES ================= */

interface Category {
  _id: string;
  categoryName: string;
  image?: string;
}

/* ================= FORM ================= */

const categoryFields: FormField[] = [
  {
    name: "categoryName",
    label: "Category Name",
    placeholder: "Enter category name",
    type: "text",
  },
  {
    name: "image",
    label: "Category Image",
    placeholder: "Select Image",
    type: "file",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /* ================= FETCH ================= */

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= CREATE ================= */

  const handleCreateCategory = async (values: any) => {
    try {
      const newCategory = await createCategory(values);

      setCategories((prev) => [...prev, newCategory]);

      toast.success("Category created");
      setFormOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  /* ================= UPDATE ================= */

  const handleUpdateCategory = async (values: any) => {
    if (!editingCategory) return;

    try {
      const updated = await updateCategory(
        editingCategory._id,
        values
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editingCategory._id ? updated : cat
        )
      );

      toast.success("Category updated");
      setEditingCategory(null);
      setFormOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);

    try {
      await deleteCategory(selectedCategory._id);

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedCategory._id)
      );

      toast.success("Category deleted");
      setDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ================= TABLE ================= */

  const columns: ColumnDefinition<Category>[] = useMemo(
    () => [
      { id: "categoryName", name: "Category Name" },
      {
        id: "image",
        name: "Image",
        render: (category) => (
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
        render: (category) => (
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
                  setEditingCategory(category);
                  setFormOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  setSelectedCategory(category);
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
    categoryName: true,
    image: true,
    action: true,
  };

  return (
    <>
      <DataTable
        data={categories}
        columns={columns}
        initialColumnVisibility={initialColumnVisibility}

        searchPlaceholder="Search category..."
        addLabel="Add Category"
        searchKey="categoryName"
        onAddClick={() => {
          setEditingCategory(null);
          setFormOpen(true);
        }}
      />

      {/* FORM */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <FormBuilder
            title={editingCategory ? "Edit Category" : "Add Category"}
            fields={categoryFields}
            defaultValues={editingCategory || {}}
            onSubmit={
              editingCategory
                ? handleUpdateCategory
                : handleCreateCategory
            }
          />
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <DeleteDialog
        isOpen={deleteOpen}
        isLoading={isDeleting}
        title="Delete Category?"
        description={`"${selectedCategory?.categoryName}" will be permanently deleted.`}
        confirmText="Delete Category"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}