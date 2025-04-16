"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchProfilePicture } from "@/utils/fetchProfilePicture";
import Pusher from "pusher-js";
import chatStyle from "@/styles/chat.module.css";

export default function Chat() {
  const { userId, isLoaded } = useAuth();
  const { friendId } = useParams();
  const username = useSearchParams().get("username");
  const [friendProfilePicture, setFriendProfilePicture] = useState("/default-avatar.png");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

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

    setSendingMessage(true);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: friendId, message: newMessage }),
      });

      setNewMessage(""); // Just clear the input
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Listen for new messages using Pusher
  useEffect(() => {
    if (!isLoaded || !userId || !friendId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("chat");

    channel.bind("message", (data) => {
      const isBetweenUsers =
        (data.sender_id === userId && data.receiver_id === friendId) ||
        (data.sender_id === friendId && data.receiver_id === userId);

      if (isBetweenUsers) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [isLoaded, userId, friendId]);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString([], {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${dateStr} at ${timeStr}`;
  };

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              {msg.sender_id === userId ? "You" : username}:<strong> {msg.message}</strong>
            </p>
            <p className={chatStyle["message-time"]}>{formatDateTime(msg.created_at)}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
