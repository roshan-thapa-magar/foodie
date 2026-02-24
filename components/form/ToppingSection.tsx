"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

interface ToppingItem {
  name: string
  price: number
}

interface ToppingSectionProps {
  title: string
  items: ToppingItem[]
}

export default function ToppingSection({
  title,
  items,
}: ToppingSectionProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-extrabold">{title}</h1>

      <FieldGroup className="space-y-4 !gap-0">
        {items.map((item, index) => {
          const checkboxId = `${title}-${index}`

          return (
            <Field
              key={checkboxId}
              orientation="horizontal"
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2 ">
                <Checkbox id={checkboxId} name={checkboxId} />

                <FieldLabel htmlFor={checkboxId}>
                  {item.name}
                </FieldLabel>
              </div>

              <span>Rs. {item.price}</span>
            </Field>
          )
        })}
      </FieldGroup>
    </div>
  )
}