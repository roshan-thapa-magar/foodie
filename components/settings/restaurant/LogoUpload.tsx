"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, ImageIcon, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export function RestaurantLogoUpload() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing logo on mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch("/api/restaurant-logo");
        const data = await res.json();
        if (data.success && data.data) {
          setLogoUrl(data.data.url);
        }
      } catch (error) {
        console.error("Failed to fetch logo", error);
      }
    };
    fetchLogo();
  }, []);

  const validateImage = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error(`${file.name} is not a supported image type.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} exceeds 5MB.`);
      return false;
    }
    return true;
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !validateImage(file)) return;

      setIsUploading(true);
      try {
        const base64 = await toBase64(file);
        const method = logoUrl ? "PUT" : "POST";

        const res = await fetch("/api/restaurant-logo", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        if (data.success) {
          setLogoUrl(data.data.url);
          toast.success(data.message || "Logo uploaded successfully");
        } else {
          toast.error(data.message || "Upload failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Upload failed");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [logoUrl]
  );

  const handleDelete = useCallback(async () => {
    if (!logoUrl) return;

    setIsUploading(true);
    try {
      const res = await fetch("/api/restaurant-logo", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLogoUrl(null);
        toast.success(data.message || "Logo deleted successfully");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    } finally {
      setIsUploading(false);
    }
  }, [logoUrl]);

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Restaurant Logo</Label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 border rounded-lg overflow-hidden">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20 border-2 border-dashed rounded-lg">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}

          {/* Delete button */}
          {logoUrl && (
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-opacity"
              aria-label="Remove logo"
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Loader always shows while uploading */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="restaurant-logo" className="cursor-pointer">
            <div className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-colors text-sm sm:text-base">
              <Upload className="h-4 w-4" />
              <span>{logoUrl ? "Change Logo" : "Upload Logo"}</span>
            </div>
          </Label>
          <Input
            id="restaurant-logo"
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Recommended size: 200x200px. Max size: 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
