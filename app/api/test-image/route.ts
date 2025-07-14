import { NextResponse } from "next/server";

export async function GET() {
  const imageUrl = "http://localhost:3000/images/xnova-energy-green.png";

  try {
    const response = await fetch(imageUrl);
    return NextResponse.json({
      imageUrl,
      status: response.status,
      accessible: response.ok,
      contentType: response.headers.get("content-type"),
    });
  } catch (error) {
    return NextResponse.json({
      imageUrl,
      error: error instanceof Error ? error.message : "Unknown error",
      accessible: false,
    });
  }
}
