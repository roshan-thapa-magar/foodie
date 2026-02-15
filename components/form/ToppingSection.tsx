"use client"

import { Checkbox } from "@/components/ui/checkbox"

interface ToppingItem {
  name: string
  price: number
}

interface ToppingSectionProps {
  title: string
  items: ToppingItem[]
}

export default function ToppingSection({ title, items }: ToppingSectionProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-extrabold mb-4">{title}</h1>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Checkbox />
              <span>{item.name}</span>
            </div>
            <span>Rs. {item.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
