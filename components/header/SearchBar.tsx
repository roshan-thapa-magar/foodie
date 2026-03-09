"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import { FoodOrderingDialog } from "@/components/food-ordering-dialog"
import { getItems } from "@/services/items.api"

const SearchBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false) // mobile dropdown
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  // Fetch items
  const fetchItems = async () => {
    try {
      const data = await getItems()
      setItems(data)
    } catch (error) {
      console.error("Failed to fetch items", error)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Focus input when mobile opens
  useEffect(() => {
    if (mobileOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [mobileOpen])

  // Click outside handler for both desktop and mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Desktop: close if clicking outside
      if (desktopRef.current && !desktopRef.current.contains(event.target as Node)) {
        setSearch("") // closing desktop dropdown
      }

      // Mobile: close if clicking outside
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredItems = items.filter((item) =>
    item.itemName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative w-full">
      {/* Desktop Search */}
      <div className="hidden md:block" ref={desktopRef}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Search items..."
            className="pl-10 focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {search && (
          <div className="absolute z-50 mt-2 w-[300px] bg-white shadow-md rounded-md">
            <div className="px-4 pt-4 pb-2 text-lg font-bold">Items and Combos</div>

            {filteredItems.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">No items found</p>
            )}

            {filteredItems.map((item) => (
              <FoodOrderingDialog key={item.id} item={item}>
                <div className="flex items-center space-x-3 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.itemName}
                    width={40}
                    height={40}
                    className="object-cover w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-semibold">{item.itemName}</span>
                </div>
              </FoodOrderingDialog>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Search */}
      <div className="md:hidden" ref={mobileRef}>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md hover:bg-muted p-1"
        >
          <Search className="w-5 h-5" />
        </button>

        {mobileOpen && (
          <div className="fixed top-1 left-10 right-0 bg-background z-50 p-3 shadow-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />

              <Input
                ref={inputRef}
                placeholder="Search items..."
                className="pl-10 pr-10 focus-visible:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {search && (
              <div className="w-full bg-white shadow-md rounded-md mt-2">
                <div className="px-4 pt-4 pb-2 text-lg font-bold">Items and Combos</div>

                {filteredItems.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No items found</p>
                )}

                {filteredItems.map((item) => (
                  <FoodOrderingDialog key={item.id} item={item}>
                    <div className="flex items-center space-x-3 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.itemName}
                        width={40}
                        height={40}
                        className="object-cover w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-semibold">{item.itemName}</span>
                    </div>
                  </FoodOrderingDialog>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar