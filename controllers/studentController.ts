import {Request, Response} from "express";
import userModel from "../models/userModel.js";


export const getMyGrades = async (req: Request, res: Response) => {
    try{
        const user = await userModel.findById(req.user?.id);
        if(!user){
            res.status(404).json({message: "User not found"});
        }
        else{
            res.status(200).json({grades: user.grades, success: true})
        }
    }
    catch(error: any){
        res.status(500).json({message: error.message, success: false});
    }
};

export const getAverageGrade = async (req: Request, res: Response) => {
    try{
        const user = await userModel.findById(req.user?.id);
        if(!user){
            res.status(404).json({message: "User not found"});
        }
        else{
            const grades = user.grades.map(g => g.grade);
            const avg = grades.length ? grades.reduce((acc: any, grade: any) => acc + grade, 0) / grades.length : 0;
    
            res.status(200).json({avg});
        }
    }
    catch(error: any){
        res.status(500).json({message: error.message, success: false});
    }
}