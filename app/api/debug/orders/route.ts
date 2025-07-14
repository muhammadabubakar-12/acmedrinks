import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get all orders with their items and products
    const orders = await db.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get webhook secret info
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const webhookSecretExists = !!webhookSecret;
    const webhookSecretLength = webhookSecret?.length;

    return NextResponse.json({
      ordersCount: orders.length,
      orders: orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        userEmail: order.user.email,
        status: order.status,
        total: order.total,
        stripeSessionId: order.stripeSessionId,
        createdAt: order.createdAt,
        itemsCount: order.items.length,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productTitle: item.product.title,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
      webhookInfo: {
        secretExists: webhookSecretExists,
        secretLength: webhookSecretLength,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
