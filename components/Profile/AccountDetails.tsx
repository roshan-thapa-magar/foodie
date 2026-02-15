'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';

export default function AccountDetails() {
  const [profileImage, setProfileImage] = useState(
    "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg"
  );
  const [hovering, setHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <span className="text-2xl font-extrabold">Account Details</span>
      <p className='font-bold'>Personal Information</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-4">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Image */}
          <div
            className="relative inline-block"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <Image
              alt="Profile Picture"
              src={profileImage || "/placeholder.svg"}
              width={96}
              height={96}
              className="rounded-full w-24 h-24 md:w-32 md:h-32 border-2 border-gray-300 object-cover"
            />

            {/* Pencil Icon on Hover */}
            <button
              onClick={handleImageClick}
              className={`absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-200 ${hovering ? 'opacity-100' : 'md:opacity-0'
                }`}
              title="Change profile picture"
            >
              <Pencil className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              aria-label="Upload profile picture"
            />
          </div>

          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="fullName"
              className="mt-1"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              className="mt-1"
              placeholder="Enter your email"
            />
          </div>

          {/* Update Button */}
          <Button variant="default" className="w-full">
            Update Details
          </Button>
        </div>

        {/* Right Column */}
        <div className="flex items-start md:items-start md:justify-end">
          <Button variant="destructive" className="w-full md:w-auto">
            Remove My Account
          </Button>
        </div>
      </div>
    </>
  );
}
