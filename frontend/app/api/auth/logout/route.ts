import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the token cookie
  response.cookies.delete("accessToken");
  response.cookies.delete("token");
  response.cookies.delete("authToken");
  response.cookies.delete("jwt");

  return response;
}
