"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProfilePicture } from "@/utils/fetchProfilePicture";
import chatStyle from "@/styles/chat.module.css";

export default function Chat() {
  const { userId, isLoaded } = useAuth();
  const { friendId } = useParams();
  const username = useSearchParams().get("username");
  const [friendProfilePicture, setFriendProfilePicture] = useState("/default-avatar.png");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load
    if (!userId || !friendId || !username) {
      return notFound();
    }

    // Fetch friend's profile image
    const fetchFriendProfilePicture = async () => {
      const imageUrl = await fetchProfilePicture(friendId);
      setFriendProfilePicture(imageUrl);
    };

    // Fetch message history from API
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?friendId=${friendId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchFriendProfilePicture();
    fetchMessages();
  }, [isLoaded, userId, friendId, username]);

  // Send a new message
  const sendMessage = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: userId,
      receiver_id: friendId,
      message: newMessage,
      created_at: new Date().toISOString(),
    };

    setSendingMessage(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: friendId, message: newMessage }),
      });

      if (response.ok) {
        setMessages((prev) => [...prev, messageData]);
        setNewMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <main className={chatStyle["container"]}>
      <div className={chatStyle["user-container"]}>
        <Image
          src={friendProfilePicture || "/default-avatar.png"}
          alt={`${username}'s profile`}
          width={36}
          height={36}
          className="profile-pic-small"
        />
        <h2>{username}</h2>
      </div>
      <div className={chatStyle["chat-container"]}>
        {messages.map((msg, index) => (
          <div
            className={`${chatStyle["message-container"]} ${
              msg.sender_id === userId ? chatStyle["sender"] : chatStyle["receiver"]
            }`}
            key={index}
          >
            <p>
              <strong>{msg.sender_id === userId ? "You" : username}:</strong> {msg.message}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className={chatStyle["search-form"]}>
        <input
          type="text"
          value={newMessage}
          placeholder="Send a message..."
          onChange={(e) => setNewMessage(e.target.value)}
          className={chatStyle["search-input"]}
          disabled={sendingMessage}
        />
        <button type="submit" disabled={sendingMessage}>
          {sendingMessage ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}
