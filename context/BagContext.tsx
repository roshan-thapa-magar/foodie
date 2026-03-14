"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

interface BagItem {
  _id: string;
  itemName: string;
  image: string;
  price: number;
  qty: number;
  totalAmount: number;
  toppings: any[];
  note?: string;
}

interface OrderItem {
  _id: string;
  userId: string;
  items: BagItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  note?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

interface BagContextType {
  bagItems: BagItem[];
  loading: boolean;
  subtotal: number;
  itemCount: number;
  orders: OrderItem[];
  fetchOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  fetchBag: () => Promise<void>;
  addToBag: (payload: any) => Promise<boolean>;
  addToOrder: (address: string, phone: string, paymentMethod: string, note: string) => Promise<boolean>;
  updateQuantity: (bagId: string, newQty: number) => Promise<void>;
  removeItem: (bagId: string) => Promise<void>;
  removeToppingItem: (bagId: string, toppingItemId: string) => Promise<void>;
  removeToppingGroup: (bagId: string, toppingGroupId: string) => Promise<void>;
  updateItemNote: (bagId: string, note: string) => Promise<void>;
  updateSelectedTopping: (
    bagId: string,
    toppingTitle: string,
    selectedItem: string
  ) => Promise<void>;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export function BagProvider({ children }: { children: ReactNode }) {
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?._id;

  // ---------------- Fetch Bag ----------------
  const fetchBag = useCallback(async () => {
    if (!userId) {
      setBagItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/bag?userId=${userId}`);
      const data = await res.json();
      setBagItems(data.items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bag");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ---------------- Fetch Orders ----------------
  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/orders/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        setOrders([]);
        return;
      }
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  }, [userId]);

  useEffect(() => {
    const socket: Socket = io({
      path: "/socket.io/",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Customer socket connected:", socket.id);
    });

    // When new order created
    socket.on("addOrder", () => {
      fetchOrders();
    });

    // When order updated (kitchen/admin)
    socket.on("orderUpdate", () => {
      fetchOrders();
    });

    // When order cancelled
    socket.on("updateStatus", () => {
      fetchOrders();
    });
    socket.on("deleteOrder", () => {
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchOrders]);

  // ---------------- Cancel Order ----------------
  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to cancel order");
        return false;
      }
      toast.success("Order cancelled successfully!");
      await fetchOrders();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
      return false;
    }
  };

  // ---------------- Add to Order ----------------
  const addToOrder = async (address: string, phone: string, paymentMethod: string, note: string) => {
    if (!userId) {
      toast.error("Please log in");
      return false;
    }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, address, phone, paymentMethod, note }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order placed successfully!");
      await fetchBag();
      await fetchOrders();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
      return false;
    }
  };

  // ---------------- Add / Update / Remove Bag ----------------
  const addToBag = async (payload: any) => {
    if (!userId) return false;
    try {
      const res = await fetch("/api/bag", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success("Added to bag successfully!");
      await fetchBag();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to bag");
      return false;
    }
  };

  const updateQuantity = async (bagId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`/api/bag/${bagId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ qty: newQty }) });
      if (!res.ok) throw new Error();
      await fetchBag();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (bagId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Item removed from bag");
      await fetchBag();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const removeToppingItem = async (bagId: string, toppingItemId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}/item/${toppingItemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Topping removed");
      await fetchBag();
    } catch {
      toast.error("Failed to remove topping");
    }
  };

  const removeToppingGroup = async (bagId: string, toppingGroupId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}/group/${toppingGroupId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Topping group removed");
      await fetchBag();
    } catch {
      toast.error("Failed to remove topping group");
    }
  };

  const updateItemNote = async (bagId: string, note: string) => {
    setBagItems(prev => prev.map(item => (item._id === bagId ? { ...item, note } : item)));
    await fetch(`/api/bag/${bagId}/note`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
  };

  const updateSelectedTopping = async (
    bagId: string,
    toppingTitle: string,
    selectedItem: string
  ) => {
    try {
      const res = await fetch(`/api/bag/${bagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toppingTitle, selectedItem }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update topping");

      toast.success("Topping updated successfully!");
      await fetchBag(); // refresh bag items
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update topping");
    }
  };



  useEffect(() => {
    fetchBag();
    fetchOrders();
  }, [fetchBag, fetchOrders]);

  return (
    <BagContext.Provider value={{
      bagItems,
      loading,
      subtotal: bagItems.reduce((total, i) => total + i.totalAmount, 0),
      itemCount: bagItems.length,
      orders,
      fetchOrders,
      cancelOrder,
      fetchBag,
      addToBag,
      addToOrder,
      updateQuantity,
      removeItem,
      removeToppingItem,
      removeToppingGroup,
      updateItemNote,
      updateSelectedTopping,
    }}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used within a BagProvider");
  return context;
}