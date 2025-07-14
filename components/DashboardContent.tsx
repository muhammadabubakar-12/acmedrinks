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
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StarRatingInput from "./StarRatingInput";
import { useSession } from "next-auth/react";

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      title: string;
      image: string;
    };
  }[];
}

interface OrderCardProps {
  order: Order;
  onMarkCompleted: (orderId: string, product: any) => void;
}

function OrderCard({ order, onMarkCompleted }: OrderCardProps) {
  return (
    <Link href={`/dashboard/order/${order.id}`}>
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
            <p className="text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-gray-500">
              {order.items.length} product{order.items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${order.total.toFixed(2)}</p>
            <span
              className={`px-2 py-1 rounded text-sm ${
                order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Image
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.title}
                width={40}
                height={40}
                className="rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">
                  {item.product.title}
                </h4>
                <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 text-center">
              +{order.items.length - 2} more item
              {order.items.length - 2 !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {order.status === "pending" && (
          <div className="mt-4 pt-4 border-t">
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onMarkCompleted(
                  order.id,
                  order.items.map((item) => item.product)
                );
              }}
              className="w-full"
            >
              Mark as Completed
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DashboardContent({ orders }: { orders: Order[] }) {
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    product?: any;
  }>({ open: false });
  const [reviewData, setReviewData] = useState({
    initials: "",
    name: "",
    comment: "",
  });
  // New state to track which order to complete
  const [pendingOrderToComplete, setPendingOrderToComplete] = useState<{
    orderId: string;
    products: any[];
  } | null>(null);

  // New: state for all product reviews in the order
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

  // Change: open modal and store order/products info
  const openReviewModal = (orderId: string, products: any[]) => {
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

  // Only mark as completed after all reviews are submitted
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
      // 2. Mark the order as completed
      const response = await fetch(
        `/api/orders/${pendingOrderToComplete.orderId}/complete`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to complete order");
      }
      // 3. Close modal, reset state, and refresh
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

  // Remove markCompleted, use openReviewModal instead

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            No orders yet — start shopping!
          </p>
          <Button asChild className="bg-black text-white hover:bg-gray-900">
            <a href="/">Browse Products</a>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending orders</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onMarkCompleted={openReviewModal}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed orders</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onMarkCompleted={openReviewModal}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

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
