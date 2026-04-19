import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";

const sendToken = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
  return token; // ✅ just return it
};

// In signup:
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });
    const token = sendToken(res, user._id.toString());

    res.status(201).json({
      token, // ✅ send token in body
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// In login:
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = sendToken(res, user._id.toString());

    res.json({
      token, // ✅ send token in body
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// logout - just a simple response now
export const logout = async (req: Request, res: Response) => {
  res.json({ message: "Logged out" });
};

// GET ME
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // If changing password, verify old one first
    if (newPassword) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      user.password = newPassword;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
