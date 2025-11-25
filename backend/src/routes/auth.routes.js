import express from "express";
import {login, logout, signUp, updateUser } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arjectProtection } from "../middleware/arcjet.middleware.js";
import { getAllContacts } from "../controller/message.controller.js";

const router = express.Router();
router.use(arjectProtection)

router.get("/test",(req,res)=>{
    res.status(200).json({message: "Arcjet protection working fine!"});
});
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update",protectedRoute, updateUser);
router.get("/check",protectedRoute,(req,res)=>{
    res.status(200).json(req.user);
})

export default router;