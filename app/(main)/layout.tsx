"use client"
import Header from "@/components/header/Header";
import ScrollingMessages from "@/components/ScrollingMessages";
import { Footer } from "@/components/ui/footer";
import { AuthModal } from "@/components/auth/AuthModal";
import type { ReactNode } from "react";
import { WhatsAppButton } from '@/components/whatsapp-button';
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideFooterOn = ["/filter"];
  const showFooter = !hideFooterOn.includes(pathname);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden ">
      {/* Header (fixed, no scroll) */}
      <div className="shrink-0 shadow-md dark:shadow-white/10">
        <Header />
        <ScrollingMessages
          messages={[
            "Restaurant is closed. Nova Delivers will reopen at 5:00 pm",
            "New menu available tomorrow!",
            "Free delivery on orders over $50",
          ]}
          duration={20} // optional, seconds per message
        />
      </div>
      <AuthModal />
      <WhatsAppButton
      />            {/* Page content (scrollable) */}
      <main className="flex-1 overflow-y-auto hide-scrollbar max-w-7xl mx-auto p-4 w-full">
        {children}
        {showFooter && <Footer />}
      </main>
    </div>
  );
}
