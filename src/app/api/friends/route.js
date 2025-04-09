import { NextResponse } from "next/server";
import { getFriends, removeFriend } from "@/utils/user-database";
import { getAuth } from "@clerk/nextjs/server";
import { getUsersWithProfilePicture } from "@/utils/clerkProfilePicture";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Fetch friends from the database
    const friends = await getFriends(userId);
    const friendsWithProfilePicture = await getUsersWithProfilePicture(friends.rows);

    return NextResponse.json(friendsWithProfilePicture);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { friendId } = await req.json();
    const { userId } = getAuth(req);

    if (!userId || !friendId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await removeFriend(userId, friendId);
    return NextResponse.json({ message: "Friend removed successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
