import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { RotatingLines } from "react-loader-spinner";
import { nanoid } from 'nanoid';


interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  availability: string;
}

export function ProductCard({ id, name, description, price, imageUrl, availability }: ProductCardProps) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  // Using nanoid to generate a unique ID for the input element
  const inputId = nanoid();
  
  // Check if product is out of stock
  const isOutOfStock = availability === "0";

  // Convert availability to a number whenever possible

  const availableQuantity = parseInt(availability, 10);
  const isNumericAvailability = !isNaN(availableQuantity);

  const handleAddToCart = () => {
    // Prevent adding to cart if out of stock
    if (isOutOfStock) {
      toast.error("Tuote ei ole saatavilla!");
      return;
    }

    // Prevent adding more than available quantity

    if (isNumericAvailability && quantity > availableQuantity) {
      toast.info("Vain " + availableQuantity + " kpl saatavilla!");
      return;
    }
    
    const item = {
      id,
      name,
      price,
      quantity,
      image: imageUrl,
      totalPrice: price * quantity,
      availability: availability,
    };
    dispatch(addItem(item));
    toast.success("Tuotteesi on lisätty ostoskoriin!");
  };

  return (
    <Card className={`w-[360px] md:w-[400px] border-3 border-black ${isOutOfStock ? 'opacity-60 bg-gray-200' : ''}`}>
      {/* Product Image */}
      <Link href={`/products/${id}`}>
      <div className="relative w-full h-[200px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RotatingLines
              width="70"
              height="70"
              color="#4fa94d"
              ariaLabel="loading"
              strokeWidth="4"
              animationDuration="0.75"
              visible={true}
            />
          </div>
        )}
        {!isLoading && (
          <div className="relative w-full h-[200px]">
            {isLoadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <RotatingLines
                  width="60"
                  height="60"
                  color="#4fa94d"
                  ariaLabel="loading"
                  strokeWidth="4"
                  animationDuration="0.75"
                  visible={true}
                />
              </div>
            )}
            <Image
              src={imageUrl || "/images/icon.png"}
              alt={name || "Product image"}
              fill
              // layout="fill"
              sizes="auto"
              priority={true}
              className={`object-cover rounded-t-lg border-2 border-gray-300 ${isOutOfStock ? 'grayscale' : ''}`}
              onError={(e) => {
                e.currentTarget.src = "/images/icon.png"; // Set fallback image
              }}
              onLoad={() => setIsLoadingImage(false)}
            />
          </div>
        )}
      </div>
      </Link>

      {/* Product Details */}
      <CardHeader>
        <Link href={`/products/${id}`}>
        <CardTitle>{name}</CardTitle>
        </Link>
        <CardDescription text={description} maxLength={120} />
      </CardHeader>
      <CardContent className="text-center items-center">
        <div className="grid w-full place-content-center gap-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <Label htmlFor={inputId}>Määrä: </Label>
            <Input
              id={inputId}
              type="number"
              defaultValue="1"
              min="1"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              disabled={isOutOfStock}
            />
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xl w-full font-bold mt-2 justify-center">Hinta: €{price}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className={`text-xl w-full font-bold mt-2 justify-center ${isOutOfStock ? 'text-red-500' : ''}`}>
              Saatavuus: {isOutOfStock ? 'Ei saatavilla' : availability}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex justify-between">
        {/* Link to Product Details */}
        <Link href={`/products/${id}`}>
          <Button variant="outline">Lisää tietoa</Button>
        </Link>

        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart} 
          disabled={isOutOfStock}
          className={isOutOfStock ? 'cursor-not-allowed' : ''}
        >
          {isOutOfStock ? 'Loppunut' : 'Lisää koriin'}
        </Button>
      </CardFooter>
    </Card>
  );
}
