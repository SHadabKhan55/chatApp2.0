import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/home.css";
import Navbar from "../components/Nav";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"],
});

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  // 1️⃣ Fetch notifications + logged-in userId
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:3000/notifications", {
          withCredentials: true,
        });

        if (res.data.success) {
          setNotifications(res.data.notifications || []);
          setUserId(res.data.loggedInUserId);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  // 2️⃣ Setup socket listener (runs once)
  useEffect(() => {
    // Always listen for real-time notifications
    socket.on("getNotification", (data) => {
      console.log("📩 New notification received:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("getNotification");
    };
  }, []);

  // 3️⃣ Add user to socket room when userId available
  useEffect(() => {
    if (userId) {
      console.log("🟢 Adding user to socket:", userId);
      socket.emit("addUser", userId);
    }
  }, [userId]);

  // 4️⃣ Mark as read (frontend only)
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  // 5️⃣ UI
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-card">
        <div className="home-header">
          <h2>Notifications</h2>
        </div>

        {notifications.length > 0 ? (
          <div className="user-list">
            {notifications.map((notif, idx) => (
              <div
                key={idx}
                className={`user-card ${notif.isRead ? "read" : "unread"}`}
              >
                <p>{notif.content}</p>
                <small>{new Date(notif.createdAt).toLocaleString()}</small>
                {!notif.isRead && (
                  <button
                    className="request-btn"
                    onClick={() => markAsRead(notif._id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-users">No notifications yet</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
