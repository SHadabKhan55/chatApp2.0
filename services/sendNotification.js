const { Notification } = require("../model/notification");
const { getIO, getOnlineUsers } = require("./socketHandler");

async function sendNotification(senderId, receiverId, type, message) {
  try {
    const notification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      notifyType: type,
      content: message,
    });

    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const receiverSocketId = onlineUsers.get(receiverId.toString());
    

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getNotification", {
        senderId,
        receiverId,
        type,
        message,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    console.log(`Notification error: ${error.message}`);
  }
}

module.exports = { sendNotification };
