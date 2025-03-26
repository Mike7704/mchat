import { NextResponse } from "next/server";
import { sendFriendRequest } from "@/utils/user-database";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { receiverId } = await req.json();
    const { userId: senderId } = getAuth(req);

    if (!senderId || !receiverId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = await sendFriendRequest(senderId, receiverId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
