import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    await db.$connect();

    // Try to query products
    const products = await db.product.findMany({
      take: 1,
    });

    await db.$disconnect();

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      productsCount: products.length,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      },
      { status: 500 }
    );
  }
}
