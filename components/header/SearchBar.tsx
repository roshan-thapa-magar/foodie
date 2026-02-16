"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"
const SearchBar = () => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when mobile search opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  return (
    <Popover>
      <div className="relative w-full">
        {/* Desktop search */}
        <PopoverTrigger asChild>
          <div className="hidden md:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search..."
                className="pl-10 focus-visible:ring-0"
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="!p-0">
          <PopoverHeader>
            <PopoverTitle className="px-4 pt-4 text-lg extrabold">Items and Combos</PopoverTitle>
            <PopoverDescription>
              <div className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDTYIeLcFSZZi9jO56bBqIHMNHYJOeNdKK2w&s"
                  alt=""
                  width={100}
                  height={100}
                  className="object-cover w-8 h-8 transition-opacity duration-1000 ease-in-out rounded-full"
                  priority
                />
                <span className="text-sm font-extrabold">Chicken Biryani (Boneless)</span>
              </div>
              <div className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                <Image
                  src="https://yashodafoods.com.np/wp-content/uploads/2024/03/features-ic-48.png"
                  alt=""
                  width={100}
                  height={100}
                  className="object-cover w-8 h-8 transition-opacity duration-1000 ease-in-out rounded-full"
                  priority
                />
                <span className="text-sm font-extrabold">Current Noodies</span>
              </div>
              <div className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                <Image
                  src="https://www.foodandwine.com/thmb/hpKAfwW_K1M27HeqZCFa92h0mzo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Malt-Liquor-vs-Beer-FT-BLOG0824-480af20918cb4fc5b7afdc35e3f1b3fc.jpg"
                  alt=""
                  width={100}
                  height={100}
                  className="object-cover w-8 h-8 transition-opacity duration-1000 ease-in-out rounded-full"
                  priority
                />
                <span className="text-sm font-extrabold">Gorkha Strong</span>
              </div>
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>

        {/* Mobile search icon */}
        <div className="md:hidden ">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md hover:bg-muted"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile search input overlay */}
          {open && (
            <Popover>
              <div className="fixed top-1 left-10 right-0 bg-background z-50 p-3 ">
                <PopoverTrigger asChild>
                  <div className="relative">
                    {/* Search icon inside input */}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />

                    {/* Input field */}
                    <Input
                      ref={inputRef}
                      placeholder="Search..."
                      className="pl-10 pr-10 focus-visible:ring-0"
                    />

                    {/* Close button inside input */}
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  </div>
                </PopoverTrigger>
                <PopoverContent align="center" className="!p-0">
                  <PopoverHeader>
                    <PopoverTitle className="px-4 pt-4 text-lg extrabold">Items and Combos</PopoverTitle>
                    <PopoverDescription>
                      <div className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        <Image
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDTYIeLcFSZZi9jO56bBqIHMNHYJOeNdKK2w&s"
                          alt=""
                          width={100}
                          height={100}
                          className="object-cover w-8 h-8 transition-opacity duration-1000 ease-in-out rounded-full"
                          priority
                        />
                        <span className="text-sm font-extrabold">Chicken Biryani (Boneless)</span>
                      </div>
                      <div className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        <Image
                          src="https://yashodafoods.com.np/wp-content/uploads/2024/03/features-ic-48.png"
                          alt=""
                          width={100}
                          height={100}
                          className="object-cover w-8 h-8 transition-opacity duration-1000 ease-in-out rounded-full"
                          priority
                        />
                        <span className="text-sm font-extrabold">Current Noodies</span>
                      </div>
                      <div className="flex items-center space-x-2 hover:bg-gray-100 px-4 py-2 cursor-pointer">
                        <Image
                          src="https://www.foodandwine.com/thmb/hpKAfwW_K1M27HeqZCFa92h0mzo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Malt-Liquor-vs-Beer-FT-BLOG0824-480af20918cb4fc5b7afdc35e3f1b3fc.jpg"
                          alt=""
                          width={100}
                          height={100}
                          className="object-cover w-8 h-8 transition-opacity duration-1000 ease-in-out rounded-full"
                          priority
                        />
                        <span className="text-sm font-extrabold">Gorkha Strong</span>
                      </div>
                    </PopoverDescription>
                  </PopoverHeader>
                </PopoverContent>
              </div>
            </Popover>
          )}
        </div>
      </div>
    </Popover>
  )
}

export default SearchBar
