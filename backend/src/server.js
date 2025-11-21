import express from "express";
import Path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();

const __dirname = Path.resolve();


const PORT = ENV.PORT || 3000;
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(Path.join(__dirname,"../frontend/dist")))

  app.get("*",(req,res) =>{
    res.sendFile(Path.join(__dirname,"../frontend","dist","index.html"))
  })
}
app.listen(PORT, () => {    
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
}); 