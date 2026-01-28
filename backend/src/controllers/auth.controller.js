import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { upsertStreamUser } from "../lib/stream.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            console.log("Signup failed: Missing fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Signup failed: User already exists", email);
            return res.status(400).json({ message: "User already exists" });
        }

        if (password.length < 6) {
            console.log("Signup failed: Password too short");
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage: "",
        });

        await user.save();
        console.log("User created successfully:", user._id);

        await upsertStreamUser({
            id: user._id.toString(),
            name: user.name,
            image: user.profileImage,
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

export const login = async (req, res) => {
    try {
        console.log("Login request received:", req.body.email);
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Login failed: User not found", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Login failed: Invalid password", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("Login successful:", user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        });
    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        console.log("Google Auth request received");
        const { token } = req.body;
        console.log("Token received length:", token?.length);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture, sub: googleId } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.profileImage) user.profileImage = picture;
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                password: "",
                role: "candidate",
                profileImage: picture,
                googleId,
            });
            await user.save();

            await upsertStreamUser({
                id: user._id.toString(),
                name: user.name,
                image: user.profileImage,
            });
        }

        const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("jwt", jwtToken, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        });

    } catch (error) {
        console.log("Error in googleAuth controller", error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};
