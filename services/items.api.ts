import api from "@/lib/axios";

export interface ItemPayload {
  itemType: "single" | "combo";
  itemName: string;
  description?: string;
  price: number;
  category: string;
  image?: File | string;
  toppings?: {
    toppingTitle: string;
    selectionType: "single" | "multiple";
    items: { title: string; price: number }[];
  }[];
}

export const getItems = async (type?: string) => {
  const res = await api.get("/items", {
    params: { type }
  });
  return res.data.items;
};

export const createItem = async (data: ItemPayload) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "toppings") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as any);
      }
    }
  });

  const res = await api.post("/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.item;
};

export const updateItem = async (id: string, data: ItemPayload) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === "toppings") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as any);
      }
    }
  });

  const res = await api.put(`/items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.item;
};

export const deleteItem = async (id: string) => {
  const res = await api.delete(`/items/${id}`);
  return res.data;
};