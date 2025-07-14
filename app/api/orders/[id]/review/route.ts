import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    const orderId = params.id;
    const { reviews } = await request.json();
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: "No reviews provided" },
        { status: 400 }
      );
    }
    // Optionally: check if order belongs to user
    const order = await db.order.findFirst({ where: { id: orderId, userId } });
    if (!order) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }
    // For each review, append to the product's reviews array
    for (const review of reviews) {
      const { productId, rating, comment } = review;
      if (!productId || !rating) continue;
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) continue;
      const currentReviews = Array.isArray(product.reviews)
        ? product.reviews
        : [];
      const newReview = {
        userId,
        orderId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      await db.product.update({
        where: { id: productId },
        data: { reviews: [...currentReviews, newReview] },
      });
    }
    return NextResponse.json({ message: "Reviews added successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
