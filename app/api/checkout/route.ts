import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    console.log("Checkout API called");
    console.log("Stripe secret key exists:", !!process.env.STRIPE_SECRET_KEY);
    console.log(
      "Stripe secret key length:",
      process.env.STRIPE_SECRET_KEY?.length
    );
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
    console.log(
      "All env vars:",
      Object.keys(process.env).filter(
        (key) => key.includes("STRIPE") || key.includes("NEXTAUTH")
      )
    );

    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    console.log("Session user:", session?.user);

    if (!session?.user) {
      console.log("No session, returning unauthorized");
      // Return redirect URL instead of error
      const signInUrl = `/auth/signin?callbackUrl=${encodeURIComponent(
        "/checkout"
      )}`;
      return NextResponse.json(
        { error: "Unauthorized", redirectUrl: signInUrl },
        { status: 401 }
      );
    }

    const { items } = await request.json();
    console.log("Items received:", items);

    const lineItems = items.map((item: any) => {
      // Fix image URL - ensure it's absolute
      let imageUrl = item.image;
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${process.env.NEXTAUTH_URL}${imageUrl}`;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: `Quantity: ${item.quantity}`,
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    console.log("Creating Stripe checkout session");
    console.log("Line items:", lineItems);
    console.log("User ID:", session.user.id);
    console.log("User email:", session.user.email);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: session.user.email || undefined,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "AU",
          "DE",
          "FR",
          "IT",
          "ES",
          "NL",
          "BE",
          "AT",
          "CH",
          "SE",
          "NO",
          "DK",
          "FI",
          "PL",
          "CZ",
          "HU",
          "RO",
          "BG",
          "HR",
          "SI",
          "SK",
          "LT",
          "LV",
          "EE",
          "IE",
          "PT",
          "GR",
          "CY",
          "MT",
          "LU",
          "IS",
          "LI",
          "MC",
          "AD",
          "SM",
          "VA",
          "IT",
          "ES",
          "FR",
          "DE",
          "AT",
          "BE",
          "NL",
          "CH",
          "LI",
          "LU",
          "MC",
          "AD",
          "SM",
          "VA",
        ],
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/?canceled=true`,
      metadata: {
        userId: session.user.id || session.user.email!,
        // Store only essential item info to stay under 500 character limit
        items: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
    });

    console.log("Stripe session created:", checkoutSession.url);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown",
    });
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
