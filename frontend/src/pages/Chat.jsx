import React, { useState, useEffect } from "react";
import "../style/chat.css";
import Navbar from "../components/Nav";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { friendId } = useParams();
  const [selectedFriend, setSelectedFriend] = useState({
    name: "Ali Raza",
    email: "ali@example.com",
  }); // 🔹 Dummy friend info
  const [messages, setMessages] = useState([
    { text: "Hey, how are you?", isSender: false },
    { text: "I'm good! What about you?", isSender: true },
    { text: "Doing great, working on a new project!", isSender: false },
    { text: "That's awesome 👏", isSender: true },
    { text: "Let's meet this weekend?", isSender: false },
  ]);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="chat-page">
      <Navbar />

      <div className="chat-container single-chat">
        {selectedFriend ? (
          <>
            {/* 🔹 Chat Header */}
            <div className="chat-header">
              <img
                src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${selectedFriend.name}`}
                alt="avatar"
                className="friend-avatar"
              />
              <span>{selectedFriend.name}</span>
            </div>

            {/* 🔹 Messages Area */}
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.isSender ? "sent" : "received"}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* 🔹 Input Box */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && console.log("send")}
              />
              <button onClick={() => console.log("send")}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-chat">
            <p>You have no chats 😥</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
