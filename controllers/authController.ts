import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import userModel from '../models/userModel.js';

export const register = async (req: Request, res: Response) => {
    const {fullName, passportId, password, role} = req.body;

    if(!fullName || !passportId || !password || !role){
         res.status(400).json({message: "All fields are required"});
    }

    try{
        const existingUser = await userModel.findOne({passportId});
        if(existingUser){
            res.status(400).json({message: "User with this Passport ID already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel(
            {
                fullName,
                passportId,
                password: hashedPassword,
                role,
                grades: []
            }
        );
        await newUser.save();
        res.status(201).json({message: "User registered successfully", user: newUser})
    }
    catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const login = async (req: Request, res: Response) => {
    const {passportId, password} = req.body;

    if(!passportId || !password){
        res.status(400).json({message: "Passport ID and password are required."});
    }

    try{
        const user = await userModel.findOne({passportId});
        if(!user){
            res.status(404).json({message: "User not found."})
        }
        else{
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                res.status(400).json({message: 'Invalid password'});
            }
    
            const token = jwt.sign(
                {id: user._id, role: user.role},
                process.env.JWT_SECRET!,
                {expiresIn: '1h'}
            );
    
            res.cookie('auth_token', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict', 
                maxAge: 3600000 
            });
    
            res.status(200).json({message: "Login successful", token});
        }
    }
    catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};