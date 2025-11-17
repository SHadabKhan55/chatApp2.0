import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../style/chat.css";
import Navbar from "../components/Nav";

const socket = io("http://localhost:3000", { withCredentials: true });

const ChatUI = () => {
  const { friendId } = useParams(); // URL se friendId
  const [chatId, setChatId] = useState(null);

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

          // 🔥 Socket room join
          // socket.emit("joinChat", id);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchChat();
  }, [friendId]);

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-container">
        <div className="chat-section">
          <div className="chat-header">
            <img
              src={`https://api.dicebear.com/8.x/avataaars/svg?seed=Friend`}
              alt="avatar"
              className="friend-avatar"
            />
            <span>Friend</span>
          </div>

          <div className="chat-messages">
            <p style={{ color: "#aaa", textAlign: "center", marginTop: "20px" }}>
              Chat ID: {chatId ? chatId : "Loading..."}
            </p>
          </div>

          <div className="chat-input">
            <input type="text" placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
