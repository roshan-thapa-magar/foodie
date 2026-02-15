"use client";

import { ChangePassword } from "@/components/settings/change-password";
import { NetworkAccessManagement } from "@/components/settings/network-access-management";

export function SecuritySettings() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ChangePassword />
      <NetworkAccessManagement />
    </div>
  );
}