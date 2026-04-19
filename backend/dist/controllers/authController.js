"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.logout = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // false locally, true in production
        sameSite: isProduction ? "none" : "lax", // lax locally, none in production
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
// SIGNUP
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exists = await userModel_1.default.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const user = await userModel_1.default.create({ name, email, password });
        sendToken(res, user._id.toString());
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.signup = signup;
// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        sendToken(res, user._id.toString());
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.login = login;
// LOGOUT
const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.json({ message: "Logged out" });
};
exports.logout = logout;
// GET ME
const getMe = async (req, res) => {
    try {
        const user = await userModel_1.default.findById(req.userId).select("-password");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getMe = getMe;
// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const { name, email, password, newPassword } = req.body;
        const user = await userModel_1.default.findById(req.userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
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
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.updateProfile = updateProfile;
