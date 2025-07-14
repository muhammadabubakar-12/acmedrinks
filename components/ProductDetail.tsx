"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/cart-context";
import { Star, Minus, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  header: string;
  description: string;
  price: number;
  image: string;
  specs: any;
  reviews: any[];
}

export default function ProductDetail({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [userMap, setUserMap] = useState<
    Record<string, { name: string; initials: string }>
  >({});

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

  // Fetch user data for reviews that need it
  useEffect(() => {
    const fetchUserData = async () => {
      const userIds = product.reviews
        .filter((review: any) => review.userId && !review.name)
        .map((review: any) => review.userId);

      if (userIds.length === 0) return;

      try {
        const response = await fetch("/api/users/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds }),
        });

        if (response.ok) {
          const users = await response.json();
          const newUserMap: Record<string, { name: string; initials: string }> =
            {};

          users.forEach((user: any) => {
            const name = user.name || user.email || "Anonymous";
            const initials = getInitials(name);
            newUserMap[user.id] = { name, initials };
          });

          setUserMap(newUserMap);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [product.reviews]);

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        },
      });
    }
  };

  function getInitials(name?: string) {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-2xl">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.floor(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({averageRating.toFixed(1)} / {reviewCount} reviews)
              </span>
            </div>
            <p className="text-2xl font-bold">${product.price}</p>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-l-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-r-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={addToCart}
              className="flex-grow bg-black text-white hover:bg-gray-900 py-6 text-lg font-medium"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="details" className="text-lg">
              Product Details
            </TabsTrigger>
            <TabsTrigger value="specs" className="text-lg">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-lg">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <p className="text-gray-700">{product.description}</p>
          </TabsContent>

          <TabsContent value="specs" className="mt-4">
            <table className="w-full text-left">
              <tbody>
                {Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <th className="py-2 pr-4 font-semibold">{key}</th>
                    <td className="py-2">{value as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {product.reviews.map((review: any, index: number) => {
                let name = review.name;
                let initials = review.initials;

                // If name/initials are missing, try to get from userMap
                if (!name && review.userId) {
                  const userData = userMap[review.userId];
                  if (userData) {
                    name = userData.name;
                    initials = userData.initials;
                  }
                }

                // Fallbacks
                name = name || "Anonymous";
                initials = initials || getInitials(name) || "?";

                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600">
                          {initials}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{name}</h3>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              review.rating && star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">{review.comment}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
