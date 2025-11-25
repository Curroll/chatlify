import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllContacts = async (req, res) => {
    try {
      const loggedInUserId = req.user?._id?.toString();
  
      if (!loggedInUserId) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }
  
      // Fetch all users except the logged-in user
      const filteredUsers = await User.find(
        { _id: { $ne: loggedInUserId } },
        "-password -emailVerified -createdAt -updatedAt -__v" // field projection
      ).lean();
  
      return res.status(200).json(filteredUsers);
  
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


export const getMsgByUserId = async (req, res) => {
    try {
      const loggedInUserId = req.user._id.toString();
      const { id: userId } = req.params; // the other user
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }
  
      // Ensure user does not send messages to themselves accidentally
      if (userId === loggedInUserId) {
        return res.status(400).json({ message: "Cannot fetch messages with yourself." });
      }
  
      // Fetch all messages between the two users
      const messages = await Message.find({
        $or: [
          { senderId: loggedInUserId, receiverId: userId },
          { senderId: userId, receiverId: loggedInUserId },
        ],
      })
        .sort({ createdAt: 1 }) // oldest → newest
        .populate("senderId", "fullname username profilePic")
        .populate("receiverId", "fullname username profilePic")
        .lean(); // improve performance
  
      return res.status(200).json(messages);
  
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const sendMessage = async (req, res) => {
    try {
      const { id: receiverId } = req.params;
      const senderId = req.user?._id;
      const { text, image } = req.body;
  
      // Basic validation
      if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required" });
      }
  
      if (!text && !image) {
        return res.status(400).json({ message: "Message must contain text or an image" });
      }
  
      let imageUrl = null;
  
      // If image exists, upload to Cloudinary
      if (image) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "chat_images",
          });
          imageUrl = uploadResponse.secure_url;
        } catch (cloudErr) {
          console.error("Cloudinary upload error:", cloudErr);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }
  
      // Create message
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
        messageType: image ? "image" : "text",
      });
  
      // TODO: Emit socket event to receiver
      // io.to(receiverId).emit("newMessage", newMessage);
  
      return res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  export const getChatPartners = async (req, res) => {
    try {
      const loggedInUserId = req.user._id.toString();
  
      // Fetch messages involving the logged-in user
      const messages = await Message.find({
        $or: [
          { senderId: loggedInUserId },
          { receiverId: loggedInUserId }
        ]
      }).lean();
  
      if (!messages.length) {
        return res.status(200).json([]);  // No chats yet
      }
  
      // Extract partner IDs (unique)
      const partnerIds = new Set();
  
      for (const msg of messages) {
        const sender = msg.senderId.toString();
        const receiver = msg.receiverId.toString();
  
        if (sender !== loggedInUserId) partnerIds.add(sender);
        if (receiver !== loggedInUserId) partnerIds.add(receiver);
      }
  
      const uniquePartnerIds = [...partnerIds];
  
      // Fetch partner user profiles
      const chatPartners = await User.find({
        _id: { $in: uniquePartnerIds }
      })
        .select("-password -emailVerified -createdAt -updatedAt -__v")
        .lean();
  
      return res.status(200).json(chatPartners);
  
    } catch (error) {
      console.error("Error fetching chat partners:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
