"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, X, Loader2, ArrowUp, ArrowDown, Edit2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_BANNERS = 5;

interface Banner {
  _id: string;
  url: string;
  order: number;
}

export function RestaurantBannersUpload() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  // Track loading state for individual items
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());

  // --- Helpers ---
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

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });

  // --- Fetch all banners ---
  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setBanners(data.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch banners");
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // --- Upload new banners ---
  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      if (banners.length + files.length > MAX_BANNERS) {
        toast.error(`You can only upload up to ${MAX_BANNERS} banners.`);
        e.target.value = "";
        return;
      }

      const invalid = files.filter((f) => !validateImage(f));
      if (invalid.length > 0) return;

      setIsUploading(true);
      try {
        const uploaded: Banner[] = await Promise.all(
          files.map(async (file) => {
            const res = await fetch("/api/banners", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ image: await fileToBase64(file) }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            return data.data;
          })
        );

        setBanners([...banners, ...uploaded]);
        toast.success(`${files.length} banner(s) uploaded successfully`);
      } catch (err: any) {
        toast.error(err.message || "Failed to upload banners");
      } finally {
        setIsUploading(false);
        e.target.value = "";
      }
    },
    [banners]
  );

  // --- Remove banner ---
  const removeBanner = async (index: number) => {
    // Add this index to loading items
    setLoadingItems(prev => new Set(prev).add(index));
    
    const banner = banners[index];
    try {
      const res = await fetch(`/api/banners/${banner._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setBanners(banners.filter((_, i) => i !== index));
      toast.success("Banner removed successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove banner");
    } finally {
      // Remove this index from loading items
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  // --- Update banner (replace image) ---
  const updateBanner = async (index: number, file: File) => {
    if (!validateImage(file)) return;
    
    // Add this index to loading items
    setLoadingItems(prev => new Set(prev).add(index));
    
    const banner = banners[index];
    try {
      const res = await fetch(`/api/banners/${banner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: await fileToBase64(file) }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const newBanners = [...banners];
      newBanners[index] = data.data;
      setBanners(newBanners);
      toast.success("Banner updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update banner");
    } finally {
      // Remove this index from loading items
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  // --- Move banner up/down ---
  const moveBanner = async (index: number, direction: "up" | "down") => {
    // Add both indices to loading items
    const newIndex = direction === "up" ? index - 1 : index + 1;
    setLoadingItems(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      newSet.add(newIndex);
      return newSet;
    });

    const newBanners = [...banners];
    [newBanners[index], newBanners[newIndex]] = [newBanners[newIndex], newBanners[index]];
    setBanners(newBanners);

    try {
      const payload = newBanners.map((b, i) => ({ id: b._id, order: i + 1 }));
      const res = await fetch("/api/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: payload }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success(`Banner moved ${direction}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update order");
    } finally {
      // Remove both indices from loading items
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        newSet.delete(newIndex);
        return newSet;
      });
    }
  };

  // --- Drag and drop handlers ---
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    const newBanners = [...banners];
    const draggedBanner = newBanners[draggedItem];
    newBanners.splice(draggedItem, 1);
    newBanners.splice(index, 0, draggedBanner);
    
    setBanners(newBanners);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem !== null) {
      // Add all items to loading during reorder
      const allIndices = new Set(banners.map((_, i) => i));
      setLoadingItems(allIndices);
      
      try {
        const payload = banners.map((b, i) => ({ id: b._id, order: i + 1 }));
        const res = await fetch("/api/banners", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ banners: payload }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        toast.success("Banner order updated");
      } catch (err: any) {
        toast.error(err.message || "Failed to update order");
        await fetchBanners(); // Revert to original order
      } finally {
        setLoadingItems(new Set());
        setDraggedItem(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Label className="text-lg font-semibold">
            Restaurant Banners
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Upload up to {MAX_BANNERS} banners. Recommended size: 1920x1080px or 16:9 ratio.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm px-3 py-1.5 bg-secondary rounded-full">
            <span className="font-medium">{banners?.length || 0}</span>
            <span className="text-muted-foreground">/{MAX_BANNERS}</span>
          </div>
          
          {banners?.length < MAX_BANNERS && (
            <Label htmlFor="restaurant-banners" className="cursor-pointer">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-sm hover:shadow-md",
                (isUploading || loadingItems.size > 0) && "opacity-50 cursor-not-allowed"
              )}>
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {isUploading ? "Uploading..." : "Add Banners"}
                </span>
              </div>
            </Label>
          )}
        </div>
      </div>

      {/* Hidden Input */}
      <Input
        id="restaurant-banners"
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={handleUpload}
        disabled={isUploading || banners?.length >= MAX_BANNERS || loadingItems.size > 0}
      />

      {/* Banners Grid */}
      {banners?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner, index) => {
            const isLoading = loadingItems.has(index);
            
            return (
              <div
                key={banner._id}
                draggable={!isUploading && loadingItems.size === 0}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative group aspect-video rounded-xl overflow-hidden",
                  "border-2 transition-all duration-200",
                  draggedItem === index 
                    ? "border-primary scale-105 shadow-xl rotate-1" 
                    : "border-transparent hover:border-primary/50",
                  isLoading ? "cursor-wait" : "cursor-move",
                  "hover:shadow-lg"
                )}
              >
                {/* Image */}
                <Image
                  src={banner.url}
                  alt={`Banner ${index + 1}`}
                  fill
                  className={cn(
                    "object-cover transition-all",
                    isLoading && "opacity-50"
                  )}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Gradient Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity",
                  isLoading ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                )} />

                {/* Action Buttons Overlay - Hide when loading this item */}
                {!isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={() => removeBanner(index)}
                      className="bg-red-500 text-white rounded-full p-2.5 hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                      title="Delete banner"
                      disabled={loadingItems.size > 0}
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ACCEPTED_IMAGE_TYPES.join(",");
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          if (file) updateBanner(index, file);
                        };
                        input.click();
                      }}
                      className="bg-yellow-500 text-white rounded-full p-2.5 hover:bg-yellow-600 hover:scale-110 transition-all shadow-lg"
                      title="Replace banner"
                      disabled={loadingItems.size > 0}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    <div className="flex flex-col gap-1 ml-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveBanner(index, "up")}
                          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 hover:scale-110 transition-all shadow-lg"
                          title="Move up"
                          disabled={loadingItems.size > 0}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {index < banners.length - 1 && (
                        <button
                          onClick={() => moveBanner(index, "down")}
                          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 hover:scale-110 transition-all shadow-lg"
                          title="Move down"
                          disabled={loadingItems.size > 0}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
                    {index + 1}/{banners.length}
                  </span>
                  {draggedItem === index && (
                    <span className="bg-primary text-white px-2.5 py-1 rounded-full text-xs font-medium animate-pulse">
                      Dragging
                    </span>
                  )}
                </div>

                {/* Individual Loading Overlay - Only shows for this specific item */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white/10 rounded-full p-3">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Empty State
        <div className="relative w-full aspect-video border-2 border-dashed rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-colors">
          <Label
            htmlFor="restaurant-banners"
            className="flex flex-col items-center justify-center h-full cursor-pointer group"
          >
            <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:scale-110 transition-transform">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <span className="text-lg font-medium text-foreground mb-1">
              No banners yet
            </span>
            <span className="text-sm text-muted-foreground text-center max-w-sm px-4">
              Click to upload your first banner. Images will be displayed in the restaurant gallery.
            </span>
            <span className="text-xs text-muted-foreground mt-4">
              Supports: JPG, PNG, GIF, WebP (Max 5MB)
            </span>
          </Label>
        </div>
      )}

      {/* Upload Progress Toast (Optional) */}
      {isUploading && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Uploading banners...</p>
              <div className="w-full bg-secondary h-1.5 rounded-full mt-2">
                <div className="bg-primary h-1.5 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}