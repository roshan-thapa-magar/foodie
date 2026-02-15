"use client"

import { useState } from "react"
import { Menu as MenuIcon, Tag, User, Power } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const MobileMenu = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleNavigate = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  const handleLogout = () => {
    setOpen(false)
    console.log("Logout")
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <SheetTrigger asChild>
        <button aria-label="Open menu">
          <MenuIcon />
        </button>
      </SheetTrigger>

      {/* Sheet */}
      <SheetContent side="left" className="w-80 flex flex-col">
        {/* Header (Required for accessibility) */}
        <SheetHeader>
          <SheetTitle className="text-3xl font-extrabold">
            NOVA
          </SheetTitle>
        </SheetHeader>

        {/* Menu Items */}
        <div className="space-y-6 px-4 mt-6">
          <button
            onClick={() => handleNavigate("/allOffers")}
            className="flex items-center gap-4 font-medium"
          >
            <Tag className="h-5 w-5" />
            Offers
          </button>

          <button
            onClick={() => handleNavigate("/myAccount")}
            className="flex items-center gap-4 font-medium"
          >
            <User className="h-5 w-5" />
            My Account
          </button>
        </div>

        {/* Logout */}
        <div className="mt-auto pb-6 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-muted-foreground hover:text-red-600 transition"
          >
            <Power className="h-5 w-5" />
            Log Out
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
