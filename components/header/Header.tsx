"use client"

import { Input } from "../ui/input"
import { Search, MousePointer2, Phone, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import SearchBar from "./SearchBar"
import UserAvatar from "./UserAvatar"
import Notifications from "./Notifications"
import ShoppingBagIcon from "./Bag"
import MobileMenu from "./MobileMenu"
import { useRouter } from "next/navigation"
import { useAuthModal } from "@/context/auth-modal-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession,signIn, signOut} from "next-auth/react";

const Header = () => {
  const router = useRouter()
  const { closeModal, openModal } = useAuthModal()
  const {data: session , status} = useSession();

  return (
    <header className="w-full shadow-sm">
      {/* <div className="px-4 py-2 text-center underline md:hidden bg-green-500">
        <p>Call us to order :- 9742531161</p>
      </div> */}
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-2">
          <div className="md:hidden flex items-center">
            <MobileMenu />
          </div>
          <h1 onClick={() => router.push("/")} className="text-2xl md:text-3xl font-extrabold m-0 cursor-pointer">
            NOVA
          </h1>
        </div>

        {/* Center / Right: Search + Icons */}
        <div className="flex items-center gap-4 md:gap-6 ">
          <SearchBar />
          <div className="flex items-center gap-2 hidden md:flex cursor-pointer">
            {/* Phone Icon */}
            <Phone className="w-6 h-6 text-foreground flex-shrink-0" />

            {/* Text */}
            <span onClick={openModal} className="flex flex-col leading-none">
              <span className="text-xs text-gray-500">CONTACT US</span>
              <span className="font-bold text-sm">9742531161</span>
            </span>
          </div>


          {/* Optional ThemeToggle */}
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-6">
            <MousePointer2 onClick={() => router.push("/allOffers")} className="w-5 h-5 cursor-pointer" />

          </div>
          {/* Always visible */}
          <Notifications />
          <ShoppingBagIcon />
          {/* Desktop only */}
          <div className="hidden md:flex">
            {status === "authenticated" ?(<UserAvatar />):(<div onClick={openModal}><User /></div>)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
