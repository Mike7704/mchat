"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { notFound } from "next/navigation";

export default function Chat() {
  const { userId, isLoaded } = useAuth();
  const { friendId } = useParams();
  const username = useSearchParams().get("username");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load
    if (!userId || !friendId || !username) {
      return notFound();
    }

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

    fetchMessages();
  }, [isLoaded, userId, friendId, username]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender_id: userId,
      receiver_id: friendId,
      message: newMessage,
      created_at: new Date().toISOString(),
    };

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
    }
  };

  return (
    <main>
      <h3>{username} Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender_id === userId ? "You" : username}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}
