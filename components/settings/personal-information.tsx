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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

interface PersonalData {
  name: string;
  email: string;
  contactNumber: string;
  address: string;
  profileImage: string;
  joinDate: string;
  accountExpiryDate: string;
}

interface PersonalInformationProps {
  profileData: PersonalData;
  setProfileData: (
    data: PersonalData | ((prev: PersonalData) => PersonalData)
  ) => void;
}

export function PersonalInformation({
  profileData,
  setProfileData,
}: PersonalInformationProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile Updated", {
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage
                src={profileData.profileImage || "/placeholder.svg"}
                alt="Profile"
              />
              <AvatarFallback>
                {profileData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="w-full sm:w-auto">
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex items-center justify-center sm:justify-start space-x-2 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors">
                  <Camera className="h-4 w-4" />
                  <span>Change Photo</span>
                </div>
              </Label>
              <Input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={profileData.contactNumber}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    contactNumber: e.target.value,
                  }))
                }
                placeholder="Enter your contact number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="join-date">Join Date</Label>
              <Input
                id="join-date"
                value={profileData.joinDate}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    joinDate: e.target.value,
                  }))
                }
                placeholder="Enter your join date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-date">Account Expiry Date</Label>
              <Input
                id="expiry-date"
                value={profileData.accountExpiryDate}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    accountExpiryDate: e.target.value,
                  }))
                }
                placeholder="Enter your account expiry date"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Personal Address</Label>
            <Textarea
              id="address"
              value={profileData.address}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Enter your personal address"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Personal Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}