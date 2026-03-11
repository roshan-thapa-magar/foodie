"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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

interface BagContextType {
  bagItems: BagItem[];
  loading: boolean;
  subtotal: number;
  itemCount: number;
  fetchBag: () => Promise<void>;
  addToBag: (payload: any) => Promise<boolean>;
  updateQuantity: (bagId: string, newQty: number) => Promise<void>;
  removeItem: (bagId: string) => Promise<void>;
  removeToppingItem: (bagId: string, toppingItemId: string) => Promise<void>;
  removeToppingGroup: (bagId: string, toppingGroupId: string) => Promise<void>;
}

const BagContext = createContext<BagContextType | undefined>(undefined);

export function BagProvider({ children }: { children: ReactNode }) {
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?._id;

  const fetchBag = async () => {
    if (!userId) {
      setBagItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/bag?userId=${userId}`);
      const data = await response.json();
      setBagItems(data.items || []);
    } catch (error) {
      console.error("Failed to load bag:", error);
      toast.error("Failed to load bag");
    } finally {
      setLoading(false);
    }
  };

  const addToBag = async (payload: any): Promise<boolean> => {
    if (!userId) {
      toast.error("Please log in");
      return false;
    }

    try {
      const res = await fetch("/api/bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add to bag");
      
      toast.success("Added to bag successfully!");
      await fetchBag(); // Refresh bag after adding
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
      return false;
    }
  };

  const updateQuantity = async (bagId: string, newQty: number) => {
    if (newQty < 1) return;

    try {
      const res = await fetch(`/api/bag/${bagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty })
      });

      if (!res.ok) throw new Error();
      
      toast.success("Quantity updated");
      await fetchBag();
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (bagId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Item removed from bag");
      await fetchBag();
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const removeToppingItem = async (bagId: string, toppingItemId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}/item/${toppingItemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Topping removed");
      await fetchBag();
    } catch {
      toast.error("Failed to remove topping");
    }
  };

  const removeToppingGroup = async (bagId: string, toppingGroupId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}/group/${toppingGroupId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Topping group removed");
      await fetchBag();
    } catch {
      toast.error("Failed to remove topping group");
    }
  };

  // Calculate subtotal and item count
  const subtotal = bagItems.reduce((total, item) => total + item.totalAmount, 0);
  const itemCount = bagItems.length;

  // Fetch bag when userId changes
  useEffect(() => {
    fetchBag();
  }, [userId]);

  return (
    <BagContext.Provider value={{
      bagItems,
      loading,
      subtotal,
      itemCount,
      fetchBag,
      addToBag,
      updateQuantity,
      removeItem,
      removeToppingItem,
      removeToppingGroup,
    }}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);
  if (context === undefined) {
    throw new Error("useBag must be used within a BagProvider");
  }
  return context;
}