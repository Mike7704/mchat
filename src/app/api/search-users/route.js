import { searchUsers } from "@/utils/user-database";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { getUsersWithProfilePicture } from "@/utils/clerkProfilePicture";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const { userId } = getAuth(req);

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "Clerk account is required" }, { status: 400 });
  }

  try {
    // Find users, excluding the current user
    const users = await searchUsers(query, userId);
    const usersWithProfilePicture = await getUsersWithProfilePicture(users);

    return NextResponse.json(usersWithProfilePicture);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
