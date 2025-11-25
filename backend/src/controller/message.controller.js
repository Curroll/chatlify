import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id;

    if (!loggedInUserId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }
    }).select("-password -emailVerified -createdAt -updatedAt -__v");

    return res.status(200).json(filteredUsers);

  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getMsgByUserId = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const {id: userId } = req.params; // the other user

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch all messages between the two users
    const messages = await Message.find({
      $or: [
        {
          senderId: loggedInUserId,
          receiverId: userId,
        },
        {
          senderId: userId,
          receiverId: loggedInUserId,
        },
      ],
    })
      .sort({ createdAt: 1 })           // old → new
      .populate("senderId", "fullname username profilePic")
      .populate("receiverId", "fullname username profilePic");

    return res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMesssage = async (req, res) => {
try {
    const {id: receiverId } = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl || null,
        messageType: image ? "image" : "text",
    });
    await newMessage.save();
    //todo: emit socket event to receiver
    res.status(201).json(newMessage);

} catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all messages where user is sender OR receiver
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        // Extract unique partner IDs
        const partnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            )
        ];

        // Fetch partner users
        const chatPartners = await User.find({
            _id: { $in: partnerIds }
        }).select("-password -emailVerified -createdAt -updatedAt -__v");

        res.status(200).json(chatPartners);

    } catch (error) {
        console.error("Error fetching chat partners:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
