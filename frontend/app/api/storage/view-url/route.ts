import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

// GET - Generate presigned URL for viewing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const expiresIn = searchParams.get("expiresIn");

    if (!key) {
      return NextResponse.json(
        { message: "Key parameter is required" },
        { status: 400 },
      );
    }

    let url = `${BACKEND_URL}/storage/view-url?key=${encodeURIComponent(key)}`;
    if (expiresIn) {
      url += `&expiresIn=${encodeURIComponent(expiresIn)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: data.message || "Failed to generate view URL" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating view URL:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
