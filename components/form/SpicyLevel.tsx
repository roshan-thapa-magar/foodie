"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export default function SpicyLevel() {
  const [value, setValue] = useState([0]) // start at 0 = NO SPICY

  const levels = {
    0: "NO SPICY",
    1: "LOW",
    2: "MEDIUM",
    3: "HIGH",
  } as const

  const currentLevel = levels[value[0] as 0 | 1 | 2 | 3]

  return (
    <div className="w-full max-w-md ">

      {/* Title */}
      <h2 className="text-xl font-semibold mt-4">Spicy Level</h2>

      {/* Current Level */}
      <div className="text-center text-2xl font-bold text-purple-600">
        {currentLevel}
      </div>

      {/* Slider */}
      <div className="relative pt-6">
        {/* Flame only if spicy > 0 */}
        {value[0] > 0 && (
          <div
            className="absolute top-0 text-3xl transition-all duration-300"
            style={{
              left: `${(value[0] / 3) * 100}%`, // left-to-right
              transform: "translateX(-50%)",
            }}
          >
            🔥
          </div>
        )}

        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={3}
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
