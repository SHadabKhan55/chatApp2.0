import React from "react";
import "../style/chat.css";
import Navbar from "../components/Nav";

const ChatUI = () => {
  return (
    <div className="chat-page">
      <Navbar />

      <div className="chat-container">
        <div className="chat-section">
          {/* Chat Header */}
          <div className="chat-header">
            <img
              src={`https://api.dicebear.com/8.x/avataaars/svg?seed=Friend`}
              alt="avatar"
              className="friend-avatar"
            />
            <span>Friend Name</span>
          </div>

          {/* Messages Area (empty for now) */}
          <div className="chat-messages">
            <p style={{ color: "#aaa", textAlign: "center", marginTop: "20px" }}>
              Messages will appear here
            </p>
          </div>

          {/* Input Box */}
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
