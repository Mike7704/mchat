import { NextResponse } from "next/server";
import { sendFriendRequest, getFriendRequests, updateFriendRequest } from "@/utils/user-database";
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

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const requests = await getFriendRequests(userId);

    return NextResponse.json(requests.rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { requestId, action } = await req.json(); // action = "accept" or "reject"
    const { userId } = getAuth(req);

    if (!userId || !requestId || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = await updateFriendRequest(requestId, action);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
