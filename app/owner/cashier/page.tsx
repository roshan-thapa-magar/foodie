"use client";

import { useState, useMemo, useEffect } from "react";
import DataTable, { type ColumnDefinition } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react";
import { DeleteDialog } from "@/components/delete-dialog";
import { EditOrderDialog } from "@/components/order/EditOrderDialog";
import { toast } from "sonner";
/* ================= TYPES ================= */
import { ViewItemsDialog } from "@/components/order/ViewItemsDialog";
import { UserDetailsDialog } from "@/components/order/UserDetailsDialog";
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export type OrderStatus = "pending" | "preparing" | "served" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentMethod = "cash" | "card" | "online";

interface Order {
  id: string; // mapped from _id
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  note?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

/* ================= COMPONENT ================= */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewItemsOpen, setViewItemsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    address?: string;
    image?: string;
  } | null>(null);
  console.log(orders)
  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders?status=pending&status=preparing&status=serve");
      const data = await res.json();

      // Map MongoDB _id to front-end id
      const mappedOrders = (data.orders || []).map((o: any) => ({
        ...o,
        id: o._id, // important for front-end operations
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailsClick = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user details");

      const data = await res.json();
      setSelectedUser(data); // data.user must match UserDetailsDialog shape
      setUserDialogOpen(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= COLUMNS ================= */
  const columns: ColumnDefinition<Order>[] = useMemo(
    () => [
      {
        id: "userId",
        name: "User Details",
        render: (order) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleUserDetailsClick(order.userId)}
          >
            User Details
          </Button>
        ),
      },
      {
        id: "items",
        name: "Items",
        render: (order) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedItems(order.items);
              setViewItemsOpen(true);
            }}
          >
            <Eye className="w-4 h-4" /> View Items
          </Button>
        ),
      },
      {
        id: "totalAmount",
        name: "Total Amount",
        render: (order) => `${order.totalAmount.toFixed(2)}`,
      },
      { id: "status", name: "Status" },
      { id: "paymentStatus", name: "Payment Status" },
      { id: "paymentMethod", name: "Payment Method" },
      { id: "note", name: "Note" },
      { id: "phone", name: "Phone" },
      { id: "address", name: "Address" },
      { id: "createdAt", name: "Created At" },
      {
        id: "action",
        name: "Action",
        align: "center",
        render: (order) => (
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(order);
                  setIsEditOpen(true);
                }}
              >
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDeleteOpen(true);
                }}
              >
                <Trash className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const initialColumnVisibility = {
    userId: true,
    items: true,
    totalAmount: true,
    status: true,
    paymentStatus: true,
    paymentMethod: true,
    note: true,
    phone: true,
    address: false,
    createdAt: false,
    action: true,
  };

  /* ================= HANDLERS ================= */
  const handleAddOrder = () => {
    console.log("Add Order clicked");
  };

  const handleSaveEdit = async (updated: {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
  }) => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to update order");

      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, ...data.order } : o))
      );
      toast.success("Order updated successfully");
      fetchOrders()
      setIsEditOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder?.id) {
      alert("Order ID is missing. Cannot delete.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete order");
        return;
      }

      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      toast.success("Order deleted successfully");
      setIsDeleteOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };



  /* ================= RENDER ================= */
  return (
    <>
      <DataTable
        data={orders}
        columns={columns}
        initialColumnVisibility={initialColumnVisibility}
        searchPlaceholder="Search by user ID..."
        addLabel="Add Order"
        onAddClick={handleAddOrder}
        searchKey="userId"
      />

      {selectedOrder && (
        <EditOrderDialog
          isOpen={isEditOpen}
          isLoading={loading}
          order={selectedOrder}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditOpen(false)}
        />
      )}
      <ViewItemsDialog
        isOpen={viewItemsOpen}
        items={selectedItems}
        onClose={() => setViewItemsOpen(false)}
      />

      <UserDetailsDialog
        isOpen={userDialogOpen}
        user={selectedUser}
        onClose={() => setUserDialogOpen(false)}
      />

      {selectedOrder && (
        <DeleteDialog
          isOpen={isDeleteOpen}
          isLoading={loading}
          title="Delete this order?"
          description="This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}
    </>
  );
}