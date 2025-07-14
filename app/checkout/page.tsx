"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processCheckout = async () => {
      console.log(
        "Processing checkout - Status:",
        status,
        "Session:",
        !!session,
        "Items:",
        state.items.length
      );

      if (status === "loading") {
        console.log("Still loading session...");
        return;
      }

      if (!session) {
        console.log("No session, redirecting to sign-in");
        router.push(
          `/auth/signin?callbackUrl=${encodeURIComponent("/checkout")}`
        );
        return;
      }

      if (state.items.length === 0) {
        console.log("No items in cart, redirecting to home");
        router.push("/");
        return;
      }

      if (isProcessing) {
        console.log("Already processing checkout...");
        return;
      }

      console.log("User authenticated and has items, processing checkout");
      setIsProcessing(true);

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: state.items }),
        });

        const data = await response.json();
        console.log("Checkout response:", response.status, data);

        if (response.ok && data.url) {
          console.log("Redirecting to Stripe checkout:", data.url);
          window.location.href = data.url;
        } else {
          console.error("Checkout failed:", data.error);
          router.push("/");
        }
      } catch (error) {
        console.error("Checkout error:", error);
        router.push("/");
      }
    };

    processCheckout();
  }, [session, status, state.items.length, isProcessing, router]);

  // Show loading while checking authentication
  if (status === "loading" || isProcessing) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">
              {status === "loading"
                ? "Checking authentication..."
                : "Processing checkout..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If we reach here, something went wrong
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Checkout Debug</h2>
          <p className="text-gray-600 mb-4">
            Status: {status} | Session: {session ? "Yes" : "No"} | Items:{" "}
            {state.items.length}
          </p>
          <div className="mb-4 text-left">
            <h3 className="font-semibold mb-2">Cart Items:</h3>
            {state.items.length === 0 ? (
              <p className="text-red-500">No items in cart</p>
            ) : (
              <ul className="text-sm">
                {state.items.map((item, index) => (
                  <li key={index}>
                    {item.title} - Qty: {item.quantity} - ${item.price}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={() => {
                console.log("Current cart state:", state);
                console.log("localStorage cart:", localStorage.getItem("cart"));
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              Debug Cart
            </button>
            <button
              onClick={async () => {
                console.log("Manual checkout test");
                const response = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ items: state.items }),
                });
                const data = await response.json();
                console.log("Manual test response:", data);
                if (data.url) {
                  window.location.href = data.url;
                }
              }}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Test Checkout API
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
