"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProfilePicture } from "@/utils/fetchProfilePicture";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch friend requests when the component mounts
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  // Fetch friend requests from the API
  const fetchFriendRequests = async () => {
    try {
      const response = await fetch("/api/friend-requests");
      const data = await response.json();

      // Fetch profile images for each friend request
      const requestsWithProfileImages = await Promise.all(
        data.map(async (request) => {
          const profileImage = await fetchProfilePicture(request.sender_id);
          return { ...request, profileImage }; // Add the profile image
        })
      );

      if (response.ok) {
        setRequests(requestsWithProfileImages);
      } else {
        console.error("Error fetching friend requests:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle accept/reject actions for friend requests
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

  // Show loading message while requests are being fetched
  if (loading) return <p>Loading friend requests...</p>;

  return (
    <div className="component-container">
      <h3>Friend Requests</h3>
      {requests.length === 0 ? (
        <div className="sub-container">
          <p>No pending friend requests.</p>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="sub-container">
            <Image
              src={request.profileImage || "/default-avatar.png"}
              alt={`${request.username}'s profile`}
              width={36}
              height={36}
              className="profile-pic-small"
            />
            <p>{request.username}</p>
            <button onClick={() => handleAction(request.id, "accept")}>Accept</button>
            <button onClick={() => handleAction(request.id, "reject")}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}
