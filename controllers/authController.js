var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
export const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, passportId, password, role } = req.body;
    if (!fullName || !passportId || !password || !role) {
        res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = yield userModel.findOne({ passportId });
        if (existingUser) {
            res.status(400).json({ message: "User with this Passport ID already exists." });
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = new userModel({
            fullName,
            passportId,
            password: hashedPassword,
            role,
            grades: []
        });
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { passportId, password } = req.body;
    if (!passportId || !password) {
        res.status(400).json({ message: "Passport ID and password are required." });
    }
    try {
        const user = yield userModel.findOne({ passportId });
        if (!user) {
            res.status(404).json({ message: "User not found." });
        }
        else {
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Invalid password' });
            }
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });
            res.status(200).json({ message: "Login successful", token });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
