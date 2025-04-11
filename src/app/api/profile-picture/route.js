import { NextResponse } from "next/server";
import clerk from "@clerk/clerk-sdk-node";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    const user = await clerk.users.getUser(userId);
    return NextResponse.json({ imageUrl: user.imageUrl });
  } catch (error) {
    console.error(`Failed to fetch Clerk user for ${userId}:`, error);
    return NextResponse.json({ imageUrl: null }, { status: 500 });
  }
}
