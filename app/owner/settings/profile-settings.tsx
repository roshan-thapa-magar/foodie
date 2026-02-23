"use client";

import { useState } from "react";
import { AccountInformation } from "@/components/settings/account-information";
import { PersonalInformation } from "@/components/settings/personal-information";
import { RestaurantInformation } from "@/components/settings/restaurant-information";

export function ProfileSettings() {
  // const [profileData, setProfileData] = useState({
  //   name: "John Doe",
  //   email: "john@restaurant.com",
  //   contactNumber: "+1 (555) 123-4567",
  //   address: "123 Main Street, City, State 12345",
  //   profileImage: "/restaurant-owner-profile.png",
  //   joinDate: "January 15, 2023",
  //   accountExpiryDate: "January 15, 2025",
  // });

  const [restaurantData, setRestaurantData] = useState({
    restaurantName: "Delicious Bites",
    restaurantLocation: "Downtown Food District, Main Street",
    restaurantType: "Italian Cuisine",
    popularItems: "Margherita Pizza, Pasta Carbonara, Tiramisu",
    restaurantContactNumber: "+1 (555) 987-6543",
    employeeSize: "10-20",
    restaurantLogo: "/restaurant-logo.png",
    openingTime: "09:00",
    closingTime: "22:00",
    operatingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false,
    },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* <AccountInformation
        joinDate={profileData.joinDate}
        accountExpiryDate={profileData.accountExpiryDate}
      /> */}
      <PersonalInformation
        // profileData={profileData}
        // setProfileData={setProfileData}
      />
      <RestaurantInformation
        restaurantData={restaurantData}
        setRestaurantData={setRestaurantData}
      />
    </div>
  );
}