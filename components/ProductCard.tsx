"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { Star } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  header: string;
  description: string;
  price: number;
  image: string;
  specs: any;
  reviews: any[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();

  // Calculate dynamic rating from actual reviews
  const calculateRating = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    const validReviews = product.reviews.filter(
      (review: any) => review.rating && review.rating > 0
    );
    if (validReviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    const totalRating = validReviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
    );
    const averageRating = totalRating / validReviews.length;
    return { averageRating, reviewCount: validReviews.length };
  };

  const { averageRating, reviewCount } = calculateRating();

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
    });
  };

  return (
    <div className="group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-gray-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({averageRating.toFixed(1)} / {reviewCount} reviews)
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <Button
            onClick={addToCart}
            className="bg-black text-white hover:bg-gray-900"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
