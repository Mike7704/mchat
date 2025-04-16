import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { fetchMessages, saveMessage } from "@/utils/user-database";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

// Fetch messages between two users
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get("friendId");

    const { userId } = getAuth(req);
    if (!userId || !friendId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const messages = await fetchMessages(userId, friendId);
    return NextResponse.json(messages.rows);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Send a new message
export async function POST(req) {
  try {
    const { receiver_id, message } = await req.json();
    const { userId } = getAuth(req);

    if (!userId || !receiver_id || !message.trim()) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const created_at = new Date().toISOString();
    await saveMessage(userId, receiver_id, message);

    // Real-time broadcast
    await pusher.trigger("chat", "message", {
      sender_id: userId,
      receiver_id,
      message,
      created_at,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
