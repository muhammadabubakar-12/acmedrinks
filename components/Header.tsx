"use client";

import Link from "next/link";
import { ShoppingBag, X, Plus, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();
  const { state, dispatch } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckout = () => {
    // Redirect to checkout page which will handle authentication
    window.location.href = "/checkout";
  };

  return (
    <header className="py-6 px-0 border-b relative">
      <div className="w-[80%] mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          ACME DRINKS
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-base font-medium text-black hover:text-gray-600 transition-colors"
          >
            Home
          </Link>
          {session && (
            <>
              <Link
                href="/dashboard"
                className="text-base font-medium text-gray-500 hover:text-gray-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/chat"
                className="text-base font-medium text-gray-500 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Support
              </Link>
            </>
          )}
          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className="text-base font-medium text-gray-500 hover:text-gray-600 transition-colors"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Cart */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingBag className="w-6 h-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 top-12 w-96 bg-white border rounded-lg shadow-lg z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Shopping Cart</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {state.items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {state.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={50}
                            height={50}
                            className="rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {item.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              ${item.price}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_QUANTITY",
                                  payload: {
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  },
                                })
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE_QUANTITY",
                                  payload: {
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  },
                                })
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                dispatch({
                                  type: "REMOVE_ITEM",
                                  payload: item.id,
                                })
                              }
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">
                          Total: ${state.total.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-black text-white hover:bg-gray-900"
                        onClick={handleCheckout}
                      >
                        Pay & Order
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Auth */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <span>{session.user?.name || session.user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat">Support Chat</Link>
                </DropdownMenuItem>
                {session.user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button className="bg-black text-white hover:bg-gray-900" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
