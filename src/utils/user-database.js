"use server";
import { sql } from "@vercel/postgres";

// Add a new user to the database
export async function addUser(id, username, email) {
  try {
    await sql`
      INSERT INTO users_mchat (id, username, email)
      VALUES (${id}, ${username}, ${email})
      ON CONFLICT (id) DO NOTHING;
    `;
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

// Update user info
export async function updateUser(id, username, email) {
  try {
    await sql`
      UPDATE users_mchat 
      SET username = ${username}, email = ${email} 
      WHERE id = ${id};
    `;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

// Delete user from the database
export async function deleteUser(id) {
  try {
    await sql`
      DELETE FROM users_mchat WHERE id = ${id};
    `;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

// Search for a user from the database
export async function searchUsers(query, currentUserId) {
  try {
    const users = await sql`
      SELECT id, username, email FROM users_mchat 
      WHERE username ILIKE ${"%" + query + "%"} 
      AND id != ${currentUserId}
      LIMIT 10;
    `;
    return users.rows;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Database error");
  }
}

// Send a friend request to a user
export async function sendFriendRequest(senderId, receiverId) {
  try {
    const result = await sql`
      INSERT INTO friends_mchat (sender_id, receiver_id, status)
      VALUES (${senderId}, ${receiverId}, 'pending')
      ON CONFLICT (sender_id, receiver_id) DO NOTHING
      RETURNING *;
    `;

    if (result.rowCount === 0) {
      return { message: "Friend request already sent!" };
    }

    return { message: "Friend request sent successfully!" };
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw new Error("Database error");
  }
}
