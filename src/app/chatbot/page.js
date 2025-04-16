"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import chatStyle from "@/styles/chat.module.css";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { role: "user", content: newMessage };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setSendingMessage(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMessage = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        alert("Error fetching from OpenAI API.");
      }
    } catch (error) {
      alert("Error fetching from OpenAI API.");
      console.log("Error fetching from OpenAI API:", error);
    } finally {
      setSendingMessage(false);
    }
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
        <Image src={"/default-avatar.png"} alt={"AI Chatbot"} width={36} height={36} className="profile-pic-small" />
        <h2>Chaty (ChatBot)</h2>
      </div>
      <div className={chatStyle["chat-container"]}>
        {messages.map((msg, index) => (
          <div
            className={`${chatStyle["message-container"]} ${
              msg.role === "user" ? chatStyle["sender"] : chatStyle["receiver"]
            }`}
            key={index}
          >
            <p>
              {msg.role === "user" ? "You" : "Chaty"}:<strong> {msg.content}</strong>
            </p>
          </div>
        ))}
        {sendingMessage && <p className={chatStyle["receiver"]}>Chaty is thinking...</p>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className={chatStyle["search-form"]}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask something..."
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
