import { addUser, updateUser, deleteUser } from "@/utils/user-database";
import { NextResponse } from "next/server";

// Add or update a Clerk user to the database
export async function POST(req) {
  const body = await req.json();

  if (body.type === "user.created") {
    const { id, username, email_addresses } = body.data;
    const email = email_addresses[0]?.email_address || "";

    if (id && username && email) {
      await addUser(id, username, email);
      return NextResponse.json({ message: "User added successfully" }, { status: 200 });
    }
  }

  if (body.type === "user.updated") {
    const { id, username, email_addresses } = body.data;
    const email = email_addresses[0]?.email_address || "";

    if (id && username && email) {
      await updateUser(id, username, email);
      return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    }
  }

  if (body.type === "user.deleted") {
    const { id } = body.data;

    if (id) {
      await deleteUser(id);
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    }
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
