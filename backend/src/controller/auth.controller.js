import { sendWelcomeEmail } from "../emails/emailHandler.js";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
      if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
      }
      if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
      }
      if(typeof password !== "string"){
        return res.status(400).json({message: "Password must be a string"});
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)){
        return res.status(400).json({message: "Invalid email address"});
      }

      const user = await User.findOne({email});
      if(user){
        return res.status(400).json({message: "Email already in use"});
      }

      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(String(password), salt); // convert to string just in case

      const newUser = new User({
        fullName,
        email,
        password: hashedPassword
      });
      if(newUser){
        const savedUser = await newUser.save();
        generateToken(savedUser._id , res);
        
        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePicture: newUser.profilePicture
        });

        try {
          await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
          
        } catch (error) {
          console.error("Error sending welcome email:", error);
        }
        
      }
  


    } catch (error) {
      console.error("Error during sign up:", error);
      res.status(500).json({message: "Internal Server Error"});
    }
}

export const login = async (req, res) =>{
  const {email,password} = req.body;
try {
  if(!email || !password){
    return  res.status(400).json({message: "All fields are required"});
  }
  const user = await User.findOne({email})
  if(!user){
    return res.status(400).json({message: "Invalid credentials"});
  }

  const isCorrectPassword = bcrypt.compareSync(String(password), user.password);
  if(!isCorrectPassword){
    return res.status(400).json({message: "Invalid credentials"});
  }
  generateToken(user._id , res);

  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePicture: user.profilePicture
  });

} catch (error) {
  console.error("Error during login:", error);
  res.status(500).json({message: "Internal Server Error"});
}
  
};

export const logout = async (req, res) =>{
  res.cookie('jwt','',{
    maxAge:0,
  });
  res.status(200).json({message: "Logged out successfully"});
};

export const updateUser = async (req, res) => {
  try {
    const {profilePicture} = req.body;
    if(!profilePicture){
      return res.status(400).json({message: "Profile picture is required"});
    }
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profilePicture)
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePicture: uploadResponse.secure_url}, {new: true});
    
    res.status(200).json({updateUser})
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

  