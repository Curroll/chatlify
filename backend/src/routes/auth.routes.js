import express from "express";
import {login, logout, signUp, updateUser } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update",protectedRoute, updateUser);
router.get("/check",protectedRoute,(req,res)=>{
    res.status(200).json(req.user);
})

export default router;