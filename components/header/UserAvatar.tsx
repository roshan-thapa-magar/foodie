"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

const UserAvatar = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user, fetchUser, loading } = useUser();
  const userId = session?.user?._id;
  useEffect(() => {
   if (userId) {
      fetchUser(userId); // fetch only if ID exists
    }
  }, [userId]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-6 h-6 cursor-pointer">
          <AvatarImage src={user?.image || "https://github.com/shadcn.png"} />
          <AvatarFallback>
            {user?.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => router.push("/myAccount")}>View Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={() => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAvatar
