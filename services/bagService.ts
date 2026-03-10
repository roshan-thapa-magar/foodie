// services/bagService.ts
export interface ToppingPayload {
  toppingTitle: string;
  selectionType: "single" | "multiple";
  items?: { title: string; price: number }[];
  selectedItem?: string;
}

export interface AddToBagPayload {
  userId: string;
  itemId: string;
  itemName: string;
  price: string | number;
  qty: number;
  image: string;
  note: string;
  toppings: ToppingPayload[];
  createdAt: string;
}

export const bagService = {
  async addItem(payload: AddToBagPayload) {
    const res = await fetch("/api/bag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add item to bag");
    return await res.json();
  },

  async getItems(userId: string) {
    const res = await fetch(`/api/bag?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch bag items");
    const data = await res.json();
    return data.items || [];
  },

  async deleteItem(bagId: string) {
    const res = await fetch(`/api/bag/${bagId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete item");
    return true;
  },

  async deleteTopping(bagId: string, toppingId: string) {
    const res = await fetch(`/api/bag/${bagId}/item/${toppingId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete topping");
    return true;
  },

  async deleteToppingGroup(bagId: string, toppingGroupId: string) {
    const res = await fetch(`/api/bag/${bagId}/group/${toppingGroupId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete topping group");
    return true;
  },

  async updateQty(bagId: string, qty: number) {
    const res = await fetch(`/api/bag/${bagId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty }),
    });
    if (!res.ok) throw new Error("Failed to update quantity");
    return true;
  },
};