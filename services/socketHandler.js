const { Server } = require("socket.io");

let io;
let onlineUsers = new Map();

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      
    });

    socket.on("disconnect", () => {
      for (let [key, sId] of onlineUsers.entries()) {
        if (sId === socket.id) onlineUsers.delete(key);
      }
      console.log("🔴 user disconnected", socket.id);
    });
  });
}

function getIO() {
  return io;
}

function getOnlineUsers() {
  return onlineUsers;
}

module.exports = { setupSocket, getIO, getOnlineUsers };
