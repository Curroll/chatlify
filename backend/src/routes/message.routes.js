import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllContacts, getChatPartners, getMsgByUserId, sendMessage } from "../controller/message.controller.js";
import { arjectProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arjectProtection,protectedRoute)

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMsgByUserId);
router.post("/send/:id", sendMessage);



export default router;