"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "../ui/input"
import { Search } from "lucide-react"

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
    <div className="relative w-full">
      {/* Desktop search */}
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
          <div className="fixed top-1 left-10 right-0 bg-background z-50 p-3 ">
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
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
