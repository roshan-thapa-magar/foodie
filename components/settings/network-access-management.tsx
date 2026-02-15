"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wifi, Plus, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface NetworkDevice {
  id: number;
  ip: string;
  date: string;
}

export function NetworkAccessManagement() {
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([
    { id: 1, ip: "192.168.10.126", date: "August 7th 2025, 1:28 pm" },
    { id: 2, ip: "192.168.1.70", date: "August 9th 2025, 9:38 pm" },
    { id: 3, ip: "192.168.1.79", date: "August 13th 2025, 10:47 am" },
  ]);

  const [serverIP] = useState("192.168.1.72");
  const [qrCodeAccess, setQrCodeAccess] = useState(true);

  const removeNetworkDevice = (id: number) => {
    setNetworkDevices((prev) => prev.filter((device) => device.id !== id));
    toast.success("Device Removed", {
      description: "Network device has been disconnected.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Access Management</CardTitle>
        <CardDescription>
          Manage devices connected to your restaurant network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-amber-700 dark:text-amber-300 font-medium">
                Server Local IP (not added): {serverIP}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <QrCode className="h-5 w-5 text-blue-600" />
            <div className="space-y-0.5">
              <Label className="text-base font-medium">QR Code Access</Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to access menu via QR code
              </p>
            </div>
          </div>
          <Switch checked={qrCodeAccess} onCheckedChange={setQrCodeAccess} />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h4 className="font-medium">Connected Devices</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-3 font-medium">SN</th>
                  <th className="text-left p-3 font-medium">IP Address</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {networkDevices.map((device, index) => (
                  <tr key={device.id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-mono">{device.ip}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {device.date}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeNetworkDevice(device.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}