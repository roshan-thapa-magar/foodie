"use client";

import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChefHat,
  Camera,
  Phone,
  Users,
  MapPin,
  Star,
  ImageIcon,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface RestaurantData {
  restaurantName: string;
  restaurantLocation: string;
  restaurantType: string;
  popularItems: string;
  restaurantContactNumber: string;
  employeeSize: string;
  restaurantLogo: string;
  openingTime: string;
  closingTime: string;
  operatingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

interface RestaurantInformationProps {
  restaurantData: RestaurantData;
  setRestaurantData: (
    data: RestaurantData | ((prev: RestaurantData) => RestaurantData)
  ) => void;
}

export function RestaurantInformation({
  restaurantData,
  setRestaurantData,
}: RestaurantInformationProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Restaurant Information Updated", {
      description: "Your restaurant details have been successfully updated.",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRestaurantData((prev) => ({
          ...prev,
          restaurantLogo: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOperatingDayChange = (day: string, checked: boolean) => {
    setRestaurantData((prev) => ({
      ...prev,
      operatingDays: {
        ...prev.operatingDays,
        [day]: checked,
      },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Restaurant Information
        </CardTitle>
        <CardDescription>
          Manage your restaurant details and operating hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Restaurant Logo
            </Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="h-20 w-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center overflow-hidden bg-muted/50">
                {restaurantData.restaurantLogo ? (
                  <img
                    src={restaurantData.restaurantLogo || "/placeholder.svg"}
                    alt="Restaurant Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="w-full sm:w-auto">
                <Label htmlFor="restaurant-logo" className="cursor-pointer">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors">
                    <Camera className="h-4 w-4" />
                    <span>Upload Logo</span>
                  </div>
                </Label>
                <Input
                  id="restaurant-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">
                  Square logo recommended. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input
                id="restaurant-name"
                value={restaurantData.restaurantName}
                onChange={(e) =>
                  setRestaurantData((prev) => ({
                    ...prev,
                    restaurantName: e.target.value,
                  }))
                }
                placeholder="Enter restaurant name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="restaurant-type">Restaurant Type</Label>
              <Select
                value={restaurantData.restaurantType}
                onValueChange={(value) =>
                  setRestaurantData((prev) => ({
                    ...prev,
                    restaurantType: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select restaurant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Italian Cuisine">
                    Italian Cuisine
                  </SelectItem>
                  <SelectItem value="Chinese Cuisine">
                    Chinese Cuisine
                  </SelectItem>
                  <SelectItem value="Indian Cuisine">Indian Cuisine</SelectItem>
                  <SelectItem value="Mexican Cuisine">
                    Mexican Cuisine
                  </SelectItem>
                  <SelectItem value="Fast Food">Fast Food</SelectItem>
                  <SelectItem value="Fine Dining">Fine Dining</SelectItem>
                  <SelectItem value="Cafe & Bakery">Cafe & Bakery</SelectItem>
                  <SelectItem value="Seafood">Seafood</SelectItem>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="BBQ & Grill">BBQ & Grill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="restaurant-contact"
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Restaurant Contact Number
              </Label>
              <Input
                id="restaurant-contact"
                value={restaurantData.restaurantContactNumber}
                onChange={(e) =>
                  setRestaurantData((prev) => ({
                    ...prev,
                    restaurantContactNumber: e.target.value,
                  }))
                }
                placeholder="Enter restaurant contact number"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="employee-size"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Employee Size
              </Label>
              <Select
                value={restaurantData.employeeSize}
                onValueChange={(value) =>
                  setRestaurantData((prev) => ({
                    ...prev,
                    employeeSize: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 employees</SelectItem>
                  <SelectItem value="6-10">6-10 employees</SelectItem>
                  <SelectItem value="10-20">10-20 employees</SelectItem>
                  <SelectItem value="20-50">20-50 employees</SelectItem>
                  <SelectItem value="50-100">50-100 employees</SelectItem>
                  <SelectItem value="100+">100+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opening-time">Opening Time</Label>
              <Input
                id="opening-time"
                type="time"
                value={restaurantData.openingTime}
                onChange={(e) =>
                  setRestaurantData((prev) => ({
                    ...prev,
                    openingTime: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing-time">Closing Time</Label>
              <Input
                id="closing-time"
                type="time"
                value={restaurantData.closingTime}
                onChange={(e) =>
                  setRestaurantData((prev) => ({
                    ...prev,
                    closingTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="restaurant-location"
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Restaurant Location
            </Label>
            <Textarea
              id="restaurant-location"
              value={restaurantData.restaurantLocation}
              onChange={(e) =>
                setRestaurantData((prev) => ({
                  ...prev,
                  restaurantLocation: e.target.value,
                }))
              }
              placeholder="Enter complete restaurant address and location details"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popular-items" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Popular Items
            </Label>
            <Textarea
              id="popular-items"
              value={restaurantData.popularItems}
              onChange={(e) =>
                setRestaurantData((prev) => ({
                  ...prev,
                  popularItems: e.target.value,
                }))
              }
              placeholder="List your most popular dishes (comma separated)"
              rows={2}
            />
            <p className="text-sm text-muted-foreground">
              Example: Margherita Pizza, Pasta Carbonara, Tiramisu
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Operating Days</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {Object.entries(restaurantData.operatingDays).map(
                ([day, isChecked]) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleOperatingDayChange(day, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={day}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                    >
                      {day}
                    </Label>
                  </div>
                )
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Select the days your restaurant is open
            </p>
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Restaurant Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}