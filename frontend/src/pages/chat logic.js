// 1) Get or Create Chat Controller

// Jab user kisi friend ko open kare → check karo ke chat hai ya nahi.
// Nahi ho to new chat create karo.
// controllers/chatController.js
const { Chat, Message } = require("../model/chatModel");

exports.getOrCreateChat = async (req, res) => {
  try {
    const userId = req.userId;  // login user
    const friendId = req.params.friendId;

    // check if chat exists between both users
    let chat = await Chat.findOne({
      members: { $all: [userId, friendId] }
    });

    // if no chat exists, create one
    if (!chat) {
      chat = await Chat.create({
        members: [userId, friendId]
      });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Chat error" });
  }
};
// ---------------------------------------------

// ✅ 2) Send Message Controller

// Message send karo → DB me save ho → chat ko update karo → socket se realtime bhejo.
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const senderId = req.userId;

    
    const message = await Message.create({
      chatId,
      sender: senderId,
      text
    });

    
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
      updatedAt: Date.now()
    });

    // realtime emit
    const io = require("../services/socketHandler").getIO();
    io.to(chatId).emit("newMessage", message);

    res.json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Message failed" });
  }
};

/*

✅ 3) Get Chat Messages

Chat kholte hi messages load honge.
-----------------------------
*/

exports.getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to load messages" });
  }
};
/*
  
✅ 4) Routes

Routes simple rakho:
*/

const router = require("express").Router();
const chatController = require("../controllers/chatController");

router.get("/chat/:friendId", chatController.getOrCreateChat);
router.get("/messages/:chatId", chatController.getMessages);
router.post("/send-message", chatController.sendMessage);

module.exports = router;


/*
  
Socket handler me ye line add karo:

socket.on("joinChat", (chatId) => {
  socket.join(chatId);
});


Frontend me chat open karte hi:

socket.emit("joinChat", chatId);
*/