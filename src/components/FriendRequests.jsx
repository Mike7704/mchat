"use client";
import { useEffect, useState } from "react";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch("/api/friend-requests");
      const data = await response.json();
      if (response.ok) {
        setRequests(data.rows);
      } else {
        console.error("Error fetching friend requests:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch("/api/friend-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId)); // Remove from friend requests
      } else {
        const data = await response.json();
        console.error("Error updating friend request:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (loading) return <p>Loading friend requests...</p>;

  return (
    <div>
      <h3>Friend Requests</h3>
      {requests.length === 0 ? (
        <p>No pending friend requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="friend-request">
            <p>{request.username}</p>
            <button onClick={() => handleAction(request.id, "accept")}>Accept</button>
            <button onClick={() => handleAction(request.id, "reject")}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}
