import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stripeSecretExists: !!process.env.STRIPE_SECRET_KEY,
    stripeSecretLength: process.env.STRIPE_SECRET_KEY?.length,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    envVars: Object.keys(process.env).filter(
      (key) =>
        key.includes("STRIPE") ||
        key.includes("NEXTAUTH") ||
        key.includes("DATABASE")
    ),
  });
}
