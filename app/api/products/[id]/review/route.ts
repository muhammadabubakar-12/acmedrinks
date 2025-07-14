import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { initials, name, comment } = await request.json()

    const product = await db.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const currentReviews = Array.isArray(product.reviews) ? product.reviews : []
    const newReview = { initials, name, comment }
    const updatedReviews = [...currentReviews, newReview]

    await db.product.update({
      where: { id: params.id },
      data: { reviews: updatedReviews },
    })

    return NextResponse.json({ message: "Review added successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
