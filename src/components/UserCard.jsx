"use client";
import { useState } from "react";

export default function UserCard({ user }) {
  const [requestSent, setRequestSent] = useState(false);

  const sendFriendRequest = async () => {
    try {
      const response = await fetch("/api/send-friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequestSent(true);
      } else {
        console.error("Error sending request:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <button onClick={sendFriendRequest} disabled={requestSent}>
        {requestSent ? "Request Sent" : "Add Friend"}
      </button>
    </div>
  );
}
