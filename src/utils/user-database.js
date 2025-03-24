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
