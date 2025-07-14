"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, DollarSign, Package } from "lucide-react";
import Link from "next/link";
import StarRatingInput from "./StarRatingInput";
import { useSession } from "next-auth/react";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      title: string;
      image: string;
      specs: any;
    };
  }[];
}

export default function OrderDetailContent({ order }: { order: Order }) {
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    product?: any;
  }>({ open: false });
  const [reviewData, setReviewData] = useState({
    initials: "",
    name: "",
    comment: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingOrderToComplete, setPendingOrderToComplete] = useState<{
    orderId: string;
    products: any[];
  } | null>(null);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  // Helper to get initials from name
  function getInitials(name?: string | null) {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }

  // Update markCompleted to open modal for all products
  const markCompleted = async (orderId: string, products: any[]) => {
    setPendingOrderToComplete({ orderId, products });
    setProductReviews(
      products.map((product: any) => ({
        productId: product.id,
        title: product.title,
        rating: 0,
        comment: "",
      }))
    );
    setReviewModal({ open: true });
  };

  // Submit all reviews and complete order
  const submitAllReviews = async () => {
    if (!pendingOrderToComplete || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Add name and initials from session to each review
      const name = session?.user?.name || "";
      const initials = getInitials(name);
      const reviewsWithUser = productReviews.map((r) => ({
        ...r,
        name,
        initials,
      }));
      await fetch(`/api/orders/${pendingOrderToComplete.orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviews: reviewsWithUser }),
      });
      await fetch(`/api/orders/${pendingOrderToComplete.orderId}/complete`, {
        method: "POST",
      });
      setReviewModal({ open: false });
      setProductReviews([]);
      setPendingOrderToComplete(null);
      window.location.reload();
    } catch (error) {
      alert("Failed to submit reviews or complete order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReview = async () => {
    if (!reviewModal.product) return;

    try {
      await fetch(`/api/products/${reviewModal.product.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      setReviewModal({ open: false });
      setReviewData({ initials: "", name: "", comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Link>
      </div>

      {/* Order Header */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Order #{order.id.slice(-8)}
            </h1>
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  Placed{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {order.status === "completed" && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    Completed{" "}
                    {new Date(order.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="flex items-center justify-end mb-2">
              {/* <DollarSign className="w-5 h-5 mr-2" /> */}
              <span className="text-2xl font-bold">
                ${order.total.toFixed(2)}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        {order.status === "pending" && (
          <div className="border-t pt-4">
            <Button
              onClick={() =>
                markCompleted(
                  order.id,
                  order.items.map((item) => item.product)
                )
              }
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isUpdating ? "Updating..." : "Mark as Completed"}
            </Button>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Order Items ({order.items.length})
        </h2>

        {order.items.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Image
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.title}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {item.product.title}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  {item.product.specs &&
                    Object.entries(item.product.specs).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span>{" "}
                        {String(value)}
                      </div>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">
                      Price per item: ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <Dialog
        open={reviewModal.open}
        onOpenChange={(open) => setReviewModal({ open })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>How did you like your products?</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {productReviews.map((review, idx) => (
              <div key={review.productId} className="border-b pb-4 mb-4">
                <div className="font-semibold mb-1">{review.title}</div>
                <StarRatingInput
                  value={review.rating}
                  onChange={(val) => {
                    setProductReviews((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, rating: val } : r
                      )
                    );
                  }}
                />
                <Textarea
                  className="mt-2"
                  placeholder="Share your experience..."
                  value={review.comment}
                  onChange={(e) => {
                    setProductReviews((prev) =>
                      prev.map((r, i) =>
                        i === idx ? { ...r, comment: e.target.value } : r
                      )
                    );
                  }}
                />
              </div>
            ))}
            <Button
              onClick={submitAllReviews}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Reviews & Complete Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
