import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    image: {
      type: String,
      default: null,
    },

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },

    // Optional file/video/audio attachment
    attachmentUrl: {
      type: String,
      default: null,
    },

    // Mark message as read by receiver
    isRead: {
      type: Boolean,
      default: false,
    },

    // Mark if delivered (useful for socket.io delivery status)
    delivered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
