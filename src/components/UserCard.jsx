"use client";
import { useState } from "react";

export default function UserCard({ user }) {
  const [requestSent, setRequestSent] = useState(user.friendship_status === "pending");
  const isFriend = user.friendship_status === "accepted";
  const hasPendingRequest = user.friendship_status === "pending";

  const sendFriendRequest = async () => {
    try {
      const response = await fetch("/api/friend-requests", {
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
    <div className="sub-container">
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      {isFriend ? (
        <p>Already Friends</p>
      ) : hasPendingRequest ? (
        <p>Friend Request Pending</p>
      ) : (
        <button onClick={sendFriendRequest} disabled={requestSent}>
          {requestSent ? "Request Sent" : "Add Friend"}
        </button>
      )}
    </div>
  );
}
