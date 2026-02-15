import Image from "next/image";
import { FoodOrderingDialog } from "@/components/food-ordering-dialog";

// Define the shape of a single combo item
interface ComboItemProps {
  item: {
    id: string | number;
    title: string;
    description?: string;
    price: string | number;
    image: string; // URL of the image
  };
  className?: string; // optional additional classes
}

export default function ComboItem({ item, className = "" }: ComboItemProps) {
  return (
     <FoodOrderingDialog item={{ name: item.title, image :item.image }}>
    <div
      key={item.id}
      className={`flex-shrink-0 border rounded-lg transition-all duration-300 ease-in-out hover:border-green-500 hover:shadow-lg cursor-pointer ${className}`}
    >
      <div className="relative w-full rounded-t-md h-32 md:h-48 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-1000 ease-in-out"
          priority
        />
      </div>
      <div className="p-4">
        <span className="font-bold text-base block truncate-text">{item.title}</span>
        <p className="text-xs text-gray-600 instruction-text">{item.description}</p>
        <span className="font-extrabold block text-lg">RS. {item.price}</span>
      </div>
    </div>
    </FoodOrderingDialog>
  );
}
