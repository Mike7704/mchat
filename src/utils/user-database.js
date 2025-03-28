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
    // Check if a request already exists
    const existingRequest = await sql`
      SELECT status FROM friends_mchat
      WHERE (sender_id = ${senderId} AND receiver_id = ${receiverId})
      OR (sender_id = ${receiverId} AND receiver_id = ${senderId});
    `;

    if (existingRequest.rowCount > 0) {
      const status = existingRequest.rows[0].status;
      if (status === "pending") {
        return { error: "Friend request already sent!" };
      }
      if (status === "accepted") {
        return { error: "You are already friends with this user!" };
      }
    }

    // Insert new friend request
    const result = await sql`
      INSERT INTO friends_mchat (sender_id, receiver_id, status)
      VALUES (${senderId}, ${receiverId}, 'pending')
      RETURNING *;
    `;

    return { message: "Friend request sent successfully!" };
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw new Error("Database error");
  }
}

// Get all pending friend requests for a user
export async function getFriendRequests(userId) {
  try {
    return await sql`
      SELECT f.id, f.sender_id, u.username, u.email
      FROM friends_mchat f
      JOIN users_mchat u ON f.sender_id = u.id
      WHERE f.receiver_id = ${userId} AND f.status = 'pending';
    `;
  } catch (error) {
    throw new Error("Error fetching friend requests");
  }
}

// Update (Accept/Reject) a friend request
export async function updateFriendRequest(requestId, action) {
  try {
    if (action === "accept") {
      return await sql`
        UPDATE friends_mchat
        SET status = 'accepted'
        WHERE id = ${requestId};
      `;
    } else if (action === "reject") {
      return await sql`
        DELETE FROM friends_mchat
        WHERE id = ${requestId};
      `;
    }
  } catch (error) {
    throw new Error("Error updating friend request");
  }
}

// Get all friends for a user
export async function getFriends(userId) {
  try {
    return await sql`
      SELECT 
      u.id, u.username, u.email 
      FROM friends_mchat f
      JOIN users_mchat u ON 
      (u.id = f.sender_id OR u.id = f.receiver_id)
      WHERE (f.sender_id = ${userId} OR f.receiver_id = ${userId})
      AND f.status = 'accepted'
      AND u.id != ${userId}; -- Exclude the user themselves
    `;
  } catch (error) {
    throw new Error("Error fetching friends list");
  }
}

// Remove a friend
export async function removeFriend(userId, friendId) {
  try {
    return await sql`
      DELETE FROM friends_mchat
      WHERE (sender_id = ${userId} AND receiver_id = ${friendId})
      OR (sender_id = ${friendId} AND receiver_id = ${userId});
    `;
  } catch (error) {
    throw new Error("Error removing friend");
  }
}
