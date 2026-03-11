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
  type?: string; // Add type field if it exists in your BagItem model
}

interface BagContextType {
  bagItems: BagItem[];
  loading: boolean;
  subtotal: number;
  itemCount: number;
  fetchBag: (type?: string) => Promise<void>; // Update the type to accept optional type parameter
  addToBag: (payload: any) => Promise<boolean>;
  updateQuantity: (bagId: string, newQty: number) => Promise<void>;
  removeItem: (bagId: string) => Promise<void>;
  removeToppingItem: (bagId: string, toppingItemId: string) => Promise<void>;
  removeToppingGroup: (bagId: string, toppingGroupId: string) => Promise<void>;
  updateItemNote: (bagId: string, note: string) => Promise<void>; // ADD THIS

}

const BagContext = createContext<BagContextType | undefined>(undefined);

export function BagProvider({ children }: { children: ReactNode }) {
  const [bagItems, setBagItems] = useState<BagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?._id;

  // Update fetchBag to accept an optional type parameter
  const fetchBag = async (type: string = "bag") => {
    if (!userId) {
      setBagItems([]);
      return;
    }

    try {
      setLoading(true);
      // Include type in the API call
      const response = await fetch(`/api/bag?userId=${userId}&type=${type}`);
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
      // Pass the type from payload or default to "bag"
      await fetchBag(payload.type || "bag");
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
      // You might want to maintain the current type when refreshing
      // This assumes you have a way to know the current type
      await fetchBag(); // This will use the default "bag" type
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
      await fetchBag(); // Refresh with default type
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
      await fetchBag(); // Refresh with default type
    } catch {
      toast.error("Failed to remove topping");
    }
  };

  const updateItemNote = async (bagId: string, note: string) => {
    // update locally
    setBagItems((prev) =>
      prev.map((item) => (item._id === bagId ? { ...item, note } : item))
    );

    // optionally, update backend
    await fetch(`/api/bag/${bagId}/note`, {
      method: "PATCH",
      body: JSON.stringify({ note }),
      headers: { "Content-Type": "application/json" },
    });
  };

  const removeToppingGroup = async (bagId: string, toppingGroupId: string) => {
    try {
      const res = await fetch(`/api/bag/${bagId}/group/${toppingGroupId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Topping group removed");
      await fetchBag(); // Refresh with default type
    } catch {
      toast.error("Failed to remove topping group");
    }
  };

  // Calculate subtotal and item count
  const subtotal = bagItems.reduce((total, item) => total + item.totalAmount, 0);
  const itemCount = bagItems.length;

  // Fetch bag when userId changes (with default type "bag")
  useEffect(() => {
    fetchBag("bag"); // You can change this default value as needed
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
      updateItemNote, 
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