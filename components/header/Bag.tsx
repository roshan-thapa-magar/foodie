'use state'
import { ChevronDown, ChevronUp, Minus, Plus, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { Button } from "../ui/button"
import { useState } from "react"

const Bag = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({}); // Track each item's customization state
  
  const toggleCustomization = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative">
          <ShoppingBag className="h-5 w-5 cursor-pointer" />

          {/* item count */}
          <span
            className="absolute -top-1 -right-1 h-4 w-4 text-xs
            flex items-center justify-center rounded-full
            bg-black text-white dark:bg-white dark:text-black"
          >
            2
          </span>
        </button>
      </SheetTrigger>

      {/* LEFT SIDE SLIDE */}
      <SheetContent side="right" className="w-80 md:w-96 flex flex-col h-full p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="text-lg sm:text-xl">Your Bag</SheetTitle>
        </SheetHeader>
        
        {/* Empty State Bag Items */}
        {/* <div className="p-4 flex flex-col justify-center items-center h-full">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        </div> */}
        
        {/* Scrollable Items Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col px-4">
            {/* Item Card */}
            <div className="border-b pb-4 mb-4">
              <div className="flex flex-row gap-3 sm:gap-4">
                {/* Image */}
                <div className="w-auto sm:w-20 md:w-24 flex-shrink-0">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyl5jrFc3LzhI0kHV3SQm5E-FfWIOTW4KReA&s"
                    alt="Veg Combo Meal"
                    height={100}
                    width={100}
                    className="h-24 object-cover rounded-md"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between gap-3">
                  {/* Top section - Title and Delete */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs sm:text-sm md:text-base font-medium leading-snug">
                      Veg Combo Meal ( 4-6 People )
                    </span>
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 cursor-pointer hover:text-red-500 transition" />
                  </div>

                  {/* Bottom section - Quantity and Price */}
                  <div className="flex flex-row justify-between items-center">
                    {/* Quantity Controls */}
                    <div className="flex items-center  bg-muted rounded-full  w-fit">
                      <Button
                      
                        size="sm"
                        className="rounded-full w-6 h-6  p-0 flex items-center justify-center cursor-pointer"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>

                      <span className="px-2 sm:px-3 text-xs sm:text-sm">{4}</span>

                      <Button
                      
                        size="sm"
                        className="rounded-full w-6 h-6  p-0 flex items-center justify-center cursor-pointer"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <span className="text-sm sm:text-base md:text-lg font-semibold ">Rs. 5000.00</span>
                  </div>
                </div>
              </div>

              {/* Customizations for this item */}
              <div className="mt-3 pt-3 border-t">
                <div 
                  className="flex justify-between items-center cursor-pointer hover:opacity-75 transition"
                  onClick={() => toggleCustomization('item-1')}
                >
                  <span className="text-xs sm:text-sm font-medium">Customizations</span>
                  <div className="flex-shrink-0">
                    {expandedItems['item-1'] ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                </div>
                {expandedItems['item-1'] && (
                  <div className="mt-2 p-2 bg-muted rounded-md text-xs sm:text-sm">
                    Add your customizations here for this item
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Checkout Button */}
        <div className="border-t px-4 py-4 space-y-2">
          <p className="flex justify-between items-center mb-4 text-xs sm:text-sm text-muted-foreground text-center">
           <span> Subtotal</span>
           <span className="font-semibold text-foreground">Rs. 5000.00</span>
          </p>
          <Button className="w-full text-sm sm:text-base">
            Proceed to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Bag
