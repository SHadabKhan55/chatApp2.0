import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../style/chat.css";
import Navbar from "../components/Nav";

const socket = io("http://localhost:3000", { withCredentials: true });

const ChatUI = () => {
  const { friendId } = useParams();
  const [chatId, setChatId] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]); // NEW ➜ all messages

  // Load chat + its messages
  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await axios.get(
          `http://localhost:3000/chat/${friendId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          const id = res.data.chat._id;
          setChatId(id);
          fetchMessages(id);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchChat();
  }, [friendId]);

  // Load messages
  async function fetchMessages(id) {
    try {
      const res = await axios.get(
        `http://localhost:3000/get-messages/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessages(res.data.messages); // SET messages in UI
      }

    } catch (error) {
      console.log(error);
    }
  }

  // Send message
  async function handleSend() {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/send-message",
        { chatId, text },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Message ko UI me add karo without reloading
        setMessages((prev) => [...prev, res.data.message]);
        setText("");
      }

    } catch (error) {
      console.log("send:", error);
    }
  }

  return (
    <div className="chat-page">
      <Navbar />

      <div className="chat-container">
        <div className="chat-section">

          <div className="chat-header">
            <span>Friend</span>
          </div>

          {/* MESSAGE LIST */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p style={{ color: "#aaa", textAlign: "center", marginTop: "20px" }}>
                No messages yet...
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg._id} className="chat-bubble">
                  <strong>{msg.sender?.name}: </strong>
                  <span>{msg.text}</span>
                </div>
              ))
            )}
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatUI;
