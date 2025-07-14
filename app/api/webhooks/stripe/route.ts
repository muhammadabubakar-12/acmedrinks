import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  console.log("🔔 Webhook received");

  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  console.log("📝 Request body length:", body.length);
  console.log("🔑 Signature header:", !!signature);
  console.log("🔐 Webhook secret exists:", !!process.env.STRIPE_WEBHOOK_SECRET);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook signature verified");
    console.log("📦 Event type:", event.type);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    console.log("💰 Processing checkout.session.completed event");
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("📋 Session metadata:", session.metadata);
    console.log("👤 User ID from metadata:", session.metadata?.userId);
    console.log("🛒 Items from metadata:", session.metadata?.items);

    if (!session.metadata?.userId || !session.metadata?.items) {
      console.error("❌ Missing required metadata in session");
      return NextResponse.json(
        { error: "Missing required metadata" },
        { status: 400 }
      );
    }

    const { userId, items } = session.metadata;
    let parsedItems;
    try {
      parsedItems = JSON.parse(items);
      console.log("✅ Items parsed successfully:", parsedItems);
    } catch (err) {
      console.error("❌ Failed to parse items JSON:", err);
      return NextResponse.json(
        { error: "Invalid items JSON" },
        { status: 400 }
      );
    }

    try {
      // Create order in database
      const order = await db.order.create({
        data: {
          userId,
          stripeSessionId: session.id,
          status: "pending",
          total: session.amount_total! / 100,
          items: {
            create: parsedItems.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      console.log("✅ Order created successfully:", order.id);
      console.log("📊 Order total:", order.total);
      console.log("📦 Order items count:", parsedItems.length);
    } catch (dbError) {
      console.error("❌ Database error creating order:", dbError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }
  } else {
    console.log("ℹ️ Ignoring event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
