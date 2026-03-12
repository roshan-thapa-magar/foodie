"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/delete-dialog";
import DataTable, { ColumnDefinition } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useBag } from "@/context/BagContext";

export default function OrderHistoryPage() {
  const router = useRouter();
  const { orders, cancelOrder, fetchOrders } = useBag();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // ---------------- Columns ----------------
  const columns: ColumnDefinition<typeof orders[number]>[] = [
    { id: "totalAmount", name: "Total (Rs.)", align: "right", render: (item) => <span>Rs. {item.totalAmount.toFixed(2)}</span> },
    {
      id: "status",
      name: "Status",
      render: (item) => {
        const colors = {
          pending: "bg-yellow-100 text-yellow-800",
          preparing: "bg-blue-100 text-blue-800",
          served: "bg-purple-100 text-purple-800",
          completed: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
        };
        const color = colors[item.status as keyof typeof colors] || "bg-gray-100 text-gray-800";
        return <Badge className={`capitalize ${color}`} variant="outline">{item.status}</Badge>;
      },
    },
    { id: "paymentStatus", name: "Payment Status", render: (item) => <Badge variant="outline" className={`capitalize ${item.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{item.paymentStatus}</Badge> },
    { id: "paymentMethod", name: "Payment Method", render: (item) => <span className="capitalize">{item.paymentMethod || "—"}</span> },
    { id: "phone", name: "Phone", render: (item) => item.phone || "—" },
    { id: "address", name: "Address", render: (item) => <div className="max-w-[150px] truncate" title={item.address}>{item.address || "—"}</div> },
    { id: "createdAt", name: "Created At", render: (item) => moment(item.createdAt).format("MMM DD, YYYY HH:mm") },
    {
      id: "actions",
      name: "Actions",
      align: "center",
      render: (item) => item.status === "pending" ? (
        <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrderId(item._id); setDeleteDialogOpen(true); }}>Cancel</Button>
      ) : <span className="text-gray-400">—</span>
    },
  ];

  const initialColumnVisibility = {
    totalAmount: true, status: true, paymentStatus: true,
    paymentMethod: true, phone: true, address: true,
    createdAt: true, actions: true
  };

  // ---------------- Cancel Order ----------------
  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    setDeletingId(selectedOrderId);
    const success = await cancelOrder(selectedOrderId);
    if (!success) { setDeletingId(null); setDeleteDialogOpen(false); setSelectedOrderId(null); return; }
    await fetchOrders();
    setDeletingId(null);
    setDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  // ---------------- New Order Redirect ----------------
  const handleNewOrder = () => router.push("/filter");

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-semibold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">No orders found.</div>
      ) : (
        <div className="flex-1 min-h-0">
          <DataTable
            data={orders}
            columns={columns}
            initialColumnVisibility={initialColumnVisibility}
            searchPlaceholder="Search by phone, address, or status..."
            addLabel="New Order"
            onAddClick={handleNewOrder}
            searchKey="phone"
          />
        </div>
      )}

      <DeleteDialog
        isOpen={deleteDialogOpen}
        isLoading={deletingId !== null}
        title="Cancel Order?"
        description="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep"
        onConfirm={handleCancelOrder}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}