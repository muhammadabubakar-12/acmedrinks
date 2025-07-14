"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CartClearer() {
  const searchParams = useSearchParams();
  const { dispatch } = useCart();

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      console.log("🎉 Payment successful, clearing cart...");
      dispatch({ type: "CLEAR_CART" });
      // Remove the success parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, dispatch]);

  return null; // This component doesn't render anything
}
