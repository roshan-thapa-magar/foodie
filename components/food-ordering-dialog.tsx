"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useUser } from "@/context/UserContext";
import { bagService } from "@/services/bagService";
import { toast } from "sonner";

interface ToppingItem {
  title: string;
  price: number;
  _id?: string;
}

interface Topping {
  toppingTitle: string;
  selectionType: "single" | "multiple";
  required?: boolean;
  items?: ToppingItem[];
}

interface Item {
  _id: string;
  itemName: string;
  image: string;
  price: string | number;
  description: string;
  toppings?: Topping[];
}

interface FoodOrderingDialogProps {
  item: Item;
  children: ReactNode;
}

export function FoodOrderingDialog({ item, children }: FoodOrderingDialogProps) {
  const { user } = useUser();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [multipleToppings, setMultipleToppings] = useState<Record<string, Set<string>>>({});
  const [singleToppings, setSingleToppings] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Initialize single toppings
  useEffect(() => {
    const initialSingle: Record<string, number> = {};
    item.toppings?.forEach((t) => {
      if (t.selectionType === "single") initialSingle[t.toppingTitle] = 0;
    });
    setSingleToppings(initialSingle);
  }, [item.toppings]);

  // Checkbox handler for multiple toppings
  const handleCheckboxChange = (group: string, title: string, checked: boolean) => {
    setMultipleToppings((prev) => {
      const groupSet = new Set(prev[group] || []);
      if (checked) groupSet.add(title);
      else groupSet.delete(title);
      return { ...prev, [group]: groupSet };
    });
  };

  // Slider handler for single toppings
  const handleSliderChange = (group: string, index: number) => {
    setSingleToppings((prev) => ({ ...prev, [group]: index }));
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!user) return alert("Please log in");
    setLoading(true); // ✅ start loading

    const toppingsPayload =
      item.toppings?.map((topping) => {
        if (topping.selectionType === "multiple") {
          const selectedItems = Array.from(multipleToppings[topping.toppingTitle] || []).map((title) => {
            const itemObj = topping.items?.find((i) => i.title === title);
            return { title: itemObj?.title || title, price: itemObj?.price || 0 };
          });
          return { toppingTitle: topping.toppingTitle, selectionType: "multiple", items: selectedItems };
        } else {
          const index = singleToppings[topping.toppingTitle] || 0;
          return {
            toppingTitle: topping.toppingTitle,
            selectionType: "single",
            selectedItem: topping.items?.[index]?.title || "",
            items: topping.items,
          };
        }
      }) || [];

    const payload = {
      userId: user._id,
      itemId: item._id,
      itemName: item.itemName,
      price: item.price,
      qty: quantity,
      image: item.image,
      note,
      toppings: toppingsPayload,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/bag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add to bag");
      toast("Added to bag successfully!");
      setOpen(false);

    } catch (err) {
      console.error(err);
      toast("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Media query hook
  const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [query]);
    return matches;
  };

  const isMobile = useMediaQuery("(max-width: 600px)");

  // SpicyLevel Slider Component
  const SpicyLevel = ({
    title,
    items,
    value,
    onChange,
  }: {
    title: string;
    items: ToppingItem[];
    value: number;
    onChange: (index: number) => void;
  }) => {
    const currentItem = items[value]?.title || "None";
    return (
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mt-4">{title}</h2>
        <div className="text-center text-2xl font-bold text-purple-600">{currentItem}</div>
        <div className="relative pt-6">
          <Slider
            value={[value]}
            onValueChange={(val) => onChange(val[0])}
            min={0}
            max={Math.max(0, items.length - 1)}
            step={1}
            className="[&>span:first-child]:bg-red-500 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:border-red-600"
          />
        </div>
      </div>
    );
  };

  // Main content
  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-1 p-4 md:p-0 space-y-2 md:mb-4 hide-scrollbar">
        <Image
          src={item.image}
          alt={item.itemName}
          height={100}
          width={100}
          className="w-full h-[30vh] object-cover rounded-lg"
        />
        <p className="font-medium">{item.description}</p>
        <p className="text-xl font-extrabold">Rs. {item.price}</p>

        <div className="space-y-4">
          {item.toppings?.map((topping) =>
            topping.selectionType === "multiple" ? (
              <div key={topping.toppingTitle} className="space-y-4">
                <h1 className="text-lg font-extrabold">{topping.toppingTitle}</h1>
                <FieldGroup className="space-y-4 !gap-0">
                  {topping.items?.map((toppingItem, index) => {
                    const checkboxId = `${topping.toppingTitle}-${index}`;
                    const checked = multipleToppings[topping.toppingTitle]?.has(toppingItem.title) || false;
                    return (
                      <Field key={checkboxId} orientation="horizontal" className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={checkboxId}
                            checked={checked}
                            onCheckedChange={(val) =>
                              handleCheckboxChange(topping.toppingTitle, toppingItem.title, val as boolean)
                            }
                          />
                          <FieldLabel htmlFor={checkboxId}>{toppingItem.title}</FieldLabel>
                        </div>
                        <span>Rs. {toppingItem.price}</span>
                      </Field>
                    );
                  })}
                </FieldGroup>
              </div>
            ) : (
              <SpicyLevel
                key={topping.toppingTitle}
                title={topping.toppingTitle}
                items={topping.items || []}
                value={singleToppings[topping.toppingTitle] || 0}
                onChange={(index) => handleSliderChange(topping.toppingTitle, index)}
              />
            )
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold mb-1">Add Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add extra instructions..."
            className="w-full border rounded-md p-2 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 p-4 md:p-0 md:pt-4 border-t bg-background sticky bottom-0 z-50">
        <div className="flex items-center space-x-4 rounded-full">
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus />
          </button>
          <span className="text-lg font-semibold min-w-[24px] text-center text-foreground">{quantity}</span>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 hover:bg-primary/90 text-primary-foreground"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus />
          </button>
        </div>
        <Button
          className="flex-1 py-2 flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={loading} // disable while loading
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </div>
  );

  // Mobile Drawer vs Desktop Dialog
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="h-auto z-[1100]">
          <DrawerHeader>
            <div className="flex justify-between items-center">
              <DrawerTitle>{item.itemName}</DrawerTitle>
              <DrawerClose asChild>
                <X />
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{item.itemName}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}