"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProfilePicture } from "@/utils/fetchProfilePicture";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends");
      const data = await response.json();

      // Fetch profile images for each friend
      const friendsWithProfileImages = await Promise.all(
        data.map(async (friend) => {
          const profileImage = await fetchProfilePicture(friend.id);
          return { ...friend, profileImage };
        })
      );

      setFriends(friendsWithProfileImages);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!confirm("Are you sure you want to remove this friend?")) return;

    try {
      const response = await fetch("/api/friends", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends(friends.filter((friend) => friend.id !== friendId)); // Remove friend from list
      } else {
        console.error("Error removing friend");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (loading) return <p>Loading friends...</p>;

  return (
    <div className="component-container">
      <h3>Friends List</h3>
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} className="sub-container">
              <Image
                src={friend.profileImage || "/default-avatar.png"}
                alt={`${friend.username}'s profile`}
                width={36}
                height={36}
                className="profile-pic-small"
              />
              <p>{friend.username}</p>
              <Link href={`/chat/${friend.id}?username=${friend.username}`} className="button">
                Message
              </Link>
              <button onClick={() => handleRemoveFriend(friend.id)}>Remove Friend</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
