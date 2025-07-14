"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Heart,
  Star,
  Minus,
  Plus,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/lib/cart-context";

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

export default function FeaturedProduct({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [selectedSize, setSelectedSize] = useState("500ml");
  const [selectedColor, setSelectedColor] = useState("black");
  const [isFavorite, setIsFavorite] = useState(false);
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

  // Helper to get initials from name
  function getInitials(name?: string) {
    if (!name) return "?";
    const words = name.trim().split(" ");
    return words
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const sizes = ["500ml", "750ml", "1L"];
  const colors = [
    { name: "Matte Black", value: "black" },
    { name: "Pearl White", value: "white" },
    { name: "Brushed Silver", value: "silver" },
    { name: "Rose Gold", value: "gold" },
  ];

  return (
    <div className="w-[90%] lg:w-[80%] mx-auto mb-16">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-16">
        {/* Product Image */}
        <div className="lg:w-1/2 order-1 lg:order-1">
          <div className="relative aspect-square">
            <div className="relative w-full h-full overflow-hidden rounded-2xl group">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-8 order-2 lg:order-2">
          <div className="transition-all duration-500 ease-in-out">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {product.title}
            </h1>
            <div className="flex items-center space-x-2">
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
          </div>

          <p className="text-2xl font-semibold transition-all duration-300">
            $ {product.price}
          </p>

          <p className="text-gray-700 text-lg leading-relaxed transition-all duration-500 ease-in-out">
            {product.description}
          </p>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Size</h2>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full flex items-center justify-center border-2 text-sm font-medium transition-all
                    ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Color</h2>
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center
                    ${
                      selectedColor === color.value
                        ? "ring-2 ring-offset-2 ring-black"
                        : "hover:ring-1 hover:ring-gray-200"
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={decrementQuantity}
                className="rounded-l-full"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={incrementQuantity}
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
            <Button
              variant="outline"
              className="p-3 bg-transparent"
              onClick={toggleFavorite}
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="sr-only">Add to Favorites</span>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Share:</span>
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Share on Facebook</span>
              <Facebook className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Share on Twitter</span>
              <Twitter className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Share on Instagram</span>
              <Instagram className="w-5 h-5" />
            </button>
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
          <TabsContent
            value="details"
            className="mt-4 transition-all duration-500"
          >
            <p className="text-gray-700">{product.description}</p>
            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
              <li>Made from high-quality, BPA-free materials</li>
              <li>Leak-proof design with convenient portability</li>
              <li>Perfect for on-the-go energy boost</li>
              <li>Fits most car cup holders</li>
              <li>Recyclable aluminum can</li>
            </ul>
          </TabsContent>
          <TabsContent
            value="specs"
            className="mt-4 transition-all duration-500"
          >
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
          <TabsContent
            value="reviews"
            className="mt-4 transition-all duration-500"
          >
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
                  <div
                    key={index}
                    className="flex items-center space-x-4 opacity-0 animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animationFillMode: "forwards",
                    }}
                  >
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
    </div>
  );
}
