"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

interface SpicyLevelProps {
  title: string            // The title of the topping section, e.g., "Drink Selection"
  items: { title: string; price: number; _id?: string }[] // options
}

export default function SpicyLevel({ title, items }: SpicyLevelProps) {
  const [value, setValue] = useState([0]) // start at first item

  // Get the current selected item's title
  const currentItem = items[value[0]]?.title || "None"

  return (
    <div className="w-full max-w-md">

      {/* Title */}
      <h2 className="text-xl font-semibold mt-4">{title}</h2>

      {/* Current Selection */}
      <div className="text-center text-2xl font-bold text-purple-600">
        {currentItem}
      </div>

      {/* Slider */}
      <div className="relative pt-6">
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={Math.max(0, items.length - 1)}
          step={1}
          className="
            [&>span:first-child]:bg-red-500
            [&_[role=slider]]:bg-red-600
            [&_[role=slider]]:border-red-600
          "
        />
      </div>
    </div>
  )
}