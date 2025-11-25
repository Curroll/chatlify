import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllContacts, getChatPartners, getMsgByUserId, sendMesssage } from "../controller/message.controller.js";
import { arjectProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arjectProtection,protectedRoute)

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/receive/:id", getMsgByUserId);
router.post("/send/:id", sendMesssage);



export default router;