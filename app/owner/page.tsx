"use client"
import React from 'react'
import { useSession,signIn, signOut} from "next-auth/react";

export default function page() {
    const {data: session , status} = useSession();
    console.log(session)
  return (
    <div>
      <h1 onClick={()=>signOut()}>{session?.user?._id}</h1>
      <p>{session?.user?.role}</p>
    </div>
  )
}
