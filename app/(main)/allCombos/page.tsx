import ComboItem from '@/components/ComboItem';
import React from 'react'
import { Loader } from 'lucide-react';

const items = [
  {
    id: 1,
    image: "/food/image1.png",
    title: "Current Noodles & Non-Veg Combo ( 8-10 People )",
    description: "Chicken 65 Biryani X2, Crispy Chicken Burger, Buffalo Chicken Wings (6Pcs.)...",
    price: "3999",
  },
  {
    id: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyl5jrFc3LzhI0kHV3SQm5E-FfWIOTW4KReA&s",
    title: "Veg Combo Meal ( 4-6 People )",
    description: "Vegetable Biryani X2, Paneer Tikka, Garlic Bread Sticks...",
    price: "2499",
  },
  {
    id: 3,
    image: "https://tkcfoods.com/cdn/shop/products/vegcombo_1080x.png.jpg?v=1626874169",
    title: "Seafood Special Combo ( 6-8 People )",
    description: "Fish Tikka, Prawn Biryani, Grilled Lobster...",
    price: "4999",
  },
  {
    id: 4,
    image: "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg",
    title: "Family Combo ( 10-12 People )",
    description: "Chicken Tikka, Mutton Biryani, Samosas (12 pcs), Soft Drinks...",
    price: "6999",
  },
  {
    id: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s",
    title: "Vegetarian Feast Combo ( 8-10 People )",
    description: "Paneer Butter Masala, Dal Makhani, Naan, Raita...",
    price: "3599",
  },
  {
    id: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s",
    title: "Mixed Combo Meal ( 6-8 People )",
    description: "Chicken Wings, Fries, Veg Pulao, Veg Spring Rolls...",
    price: "2999",
  },
  {
    id: 7,
    image: "https://www.recipetineats.com/tachyon/2023/12/Seafood-Platter_Sony-5.jpg",
    title: "Family Combo ( 10-12 People )",
    description: "Chicken Tikka, Mutton Biryani, Samosas (12 pcs), Soft Drinks...",
    price: "6999",
  },
  {
    id: 8,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKqTeD4KEZ_ahv2l9C1QCzCwHAPaQA95g4yA&s",
    title: "Vegetarian Feast Combo ( 8-10 People )",
    description: "Paneer Butter Masala, Dal Makhani, Naan, Raita...",
    price: "3599",
  },
  {
    id: 9,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShCqHH38CajH9gdcosD9hZHslFUZOduck3Lg&s",
    title: "Mixed Combo Meal ( 6-8 People )",
    description: "Chicken Wings, Fries, Veg Pulao, Veg Spring Rolls...",
    price: "2999",
  }
];
export default function page() {
  return (
    <div>
      <div className='flex justify-between items-center pb-4'>
        <span className="text-xl font-extrabold">Combo Meals</span>
         <Loader className="animate-spin text-blue-500" size={40} />
      </div>
     <div className="grid custom-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {items.map((item) => (
               <ComboItem key={item.id} item={item} className="w-full"/>  
             ))}
           </div>
    </div>
  )
}
