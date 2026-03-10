'use client'

import { ChevronDown, ChevronUp, Loader2, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import SpicyLevel from "../form/SpicyLevel"
import { toast } from "sonner"

interface BagItem {
  _id: string
  itemName: string
  image: string
  price: number
  qty: number
  totalAmount: number
  toppings: any[]
}

const Bag = () => {

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [bagItems, setBagItems] = useState<BagItem[]>([])
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null)
  const [deletingToppingId, setDeletingToppingId] = useState<string | null>(null)
  const userId = session?.user?._id
  const [updatingQtyId, setUpdatingQtyId] = useState<string | null>(null) // NEW

  const toggleCustomization = (itemId: string) => {

    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const fetchBag = async () => {
    if (!userId) return

    try {
      setLoading(true)

      const response = await fetch(`/api/bag?userId=${userId}`)
      const data = await response.json()

      setBagItems(data.items || [])
    } catch (error) {
      toast.error("Failed to load bag")
    } finally {
      setLoading(false)
    }
  }

  const deleteBagItem = async (bagId: string) => {
    try {
      setDeletingItemId(bagId)

      const res = await fetch(`/api/bag/${bagId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast.success("Item removed from bag")

      fetchBag()

    } catch (error) {
      toast.error("Failed to remove item")
    } finally {
      setDeletingItemId(null)
    }
  }

  const deleteToppingItem = async (bagId: string, toppingItemId: string) => {
    try {
      setDeletingToppingId(toppingItemId)

      const res = await fetch(`/api/bag/${bagId}/item/${toppingItemId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast.success("Topping removed")

      fetchBag()

    } catch (error) {
      toast.error("Failed to remove topping")
    } finally {
      setDeletingToppingId(null)
    }
  }

  const deleteToppingGroup = async (bagId: string, toppingGroupId: string) => {
    try {
      setDeletingToppingId(toppingGroupId)

      const res = await fetch(`/api/bag/${bagId}/group/${toppingGroupId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast.success("Topping Group removed")

      fetchBag()

    } catch (error) {
      toast.error("Failed to remove topping Group")
    } finally {
      setDeletingToppingId(null)
    }
  }
  const updateQty = async (bagId: string, newQty: number) => {
    if (newQty < 1) return // prevent negative or zero

    try {
      setUpdatingQtyId(bagId)
      const res = await fetch(`/api/bag/${bagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty })
      })
      if (!res.ok) throw new Error()
      toast.success("Quantity updated")
      fetchBag()
    } catch {
      toast.error("Failed to update quantity")
    } finally {
      setUpdatingQtyId(null)
    }
  }


  useEffect(() => {
    fetchBag()
  }, [userId])


  const subtotal = bagItems.reduce((total, item) => total + item.totalAmount, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingBag className="h-5 w-5 cursor-pointer" />

          {/* dynamic item count */}
          <span
            className="absolute -top-1 -right-1 h-4 w-4 text-xs
            flex items-center justify-center rounded-full
            bg-black text-white dark:bg-white dark:text-black"
          >
            {bagItems.length}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 md:w-96 flex flex-col h-full p-0">

        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="text-lg sm:text-xl">Your Bag</SheetTitle>
        </SheetHeader>

        {/* EMPTY STATE */}
        {bagItems.length === 0 && (
          <div className="p-4 flex flex-col justify-center items-center h-full">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          </div>
        )}

        {/* ITEMS */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col px-4">

            {bagItems.map((item) => (
              <div key={item._id} className="border-b pb-4 mb-4">

                <div className="flex flex-row gap-3 sm:gap-4">

                  <div className="w-auto sm:w-20 md:w-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.itemName}
                      height={100}
                      width={100}
                      className="h-24 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-3">

                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs sm:text-sm md:text-base font-medium">
                        {item.itemName}
                      </span>

                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </span>
                      ) : (
                        <Trash2 onClick={() => deleteBagItem(item._id)} className="w-4 h-4 cursor-pointer hover:text-red-500" />
                      )}
                    </div>

                    <div className="flex flex-row justify-between items-center">

                      <div className="flex items-center bg-muted rounded-full w-fit">

                        <Button
                          size="sm"
                          className="rounded-full w-6 h-6 p-0"
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          disabled={updatingQtyId === item._id}
                        >
                          {updatingQtyId === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Minus className="w-3 h-3" />}
                        </Button>
                        <span className="px-2 text-xs">{item.qty}</span>

                        <Button
                          size="sm"
                          className="rounded-full w-6 h-6 p-0"
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          disabled={updatingQtyId === item._id}
                        >
                          {updatingQtyId === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        </Button>

                      </div>

                      <span className="text-sm font-semibold">
                        Rs. {item.totalAmount}
                      </span>

                    </div>

                  </div>

                </div>

                {/* CUSTOMIZATION */}
                {item.toppings?.length > 0 && (
                  <div className="mt-3 pt-3 border-t">

                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleCustomization(item._id)}
                    >
                      <span className="text-xs sm:text-sm font-medium">
                        Customizations
                      </span>

                      {expandedItems[item._id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}

                    </div>

                    {expandedItems[item._id] && (

                      <div className="mt-2 p-2  space-y-6 bg-muted rounded-md text-xs">
                        {item.toppings.map((topping, i) => (
                          <div key={i}>
                            {topping.selectionType === "multiple" ? (
                              <>
                                <div className="flex justify-between items-center">
                                  <p className="text-lg font-extrabold mb-2">{topping.toppingTitle}</p>
                                  <Trash2 onClick={() => deleteToppingGroup(item._id, topping._id)} className="w-4 h-4 cursor-pointer" />
                                </div>
                                {topping.items.map((t: any, j: number) => (
                                  <p key={j} className="flex justify-between items-center space-y-2 text-base">
                                    <span>{t.title} (+Rs. {t.price})</span>

                                    {loading ? (
                                      <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      </span>
                                    ) : (
                                      <Trash2 onClick={() => deleteToppingItem(item._id, t._id)} className="w-4 h-4 cursor-pointer fill-bg-red-500" />
                                    )}
                                  </p>
                                ))}
                              </>
                            ) : (
                              <div className="relative">
                                <Trash2 onClick={() => deleteToppingGroup(item._id, topping._id)} className="absolute right-0  w-4 h-4 cursor-pointer" />
                                <SpicyLevel
                                  key={i}
                                  title={topping.toppingTitle}
                                  items={topping.items || []}
                                  selectedItem={topping.selectedItem} // from backend
                                />
                              </div>
                            )}
                          </div>
                        ))}

                      </div>

                    )}

                  </div>
                )}

              </div>
            ))}

          </div>
        </div>

        {/* FOOTER */}
        {bagItems.length > 0 && (
          <div className="border-t px-4 py-4 space-y-2">

            <p className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                Rs. {subtotal.toFixed(2)}
              </span>
            </p>

            <Button className="w-full">
              Proceed to Checkout
            </Button>

          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}

export default Bag