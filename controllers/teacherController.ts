import { Request, Response } from "express";
import userModel, {Role} from "../models/userModel.js";


export const addGrade = async (req: Request, res: Response) => {
    const {studentId, subject, grade} = req.body;
    try{
        const student = await userModel.findById(studentId);
        if(!student || student.role !== Role.student){
            res.status(404).json({message: "Student not found."});
        }
        else{
            const gradeExists = student.grades.some(g => g.subject === subject);
            if(gradeExists){
                res.status(400).json({message: "Grade for this subject exists already"});
            }
    
            student.grades.push({subject, grade});
            await student.save();
    
            res.status(201).json({message: "Grade added.", grades: student.grades});
        }
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
};

export const editGrade = async (req: Request, res: Response) => {
    const {studentId, subject, grade} = req.body;
    try{
        const student = await userModel.findById(studentId);
        if(!student || student.role !== Role.student){
            res.status(404).json({message: "Student not found."});
        }
        else{
            const gradeIndex = student.grades.findIndex(g => g.subject === subject);
            if(gradeIndex === -1){
                res.status(404).json({message: "Grade for this subject not found"});
            }

            student.grades[gradeIndex].grade = grade;
            await student.save();
            res.status(200).json({message: "Graded updated", grades: student.grades});
            }
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
};

export const deleteGrade = async (req: Request, res: Response) => {
    const {studentId, subject} = req.body;
    try{
        const student = await userModel.findById(studentId);
        if(!student || student.role !== Role.student){
            res.status(404).json({message: "Student not found."})
        }
        else{
            const gradeIndex = student.grades.findIndex(g => g.subject === subject);
            if(gradeIndex === -1){
                res.status(404).json({message: "Grade for this subject not found"});
            }
    
            student.grades.splice(gradeIndex, 1);
            await student.save();
            res.status(200).json({message: "Grade deleted", grades: student.grades});
        }
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try{
        const users = await userModel.find();
        res.status(200).json(users)
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
};

export const getStudentsGrades = async (req: Request, res: Response) => {
    const {studentId} = req.params;
    try{
        const student = await userModel.findById(studentId);
        if(!student || student.role !== Role.student){
            res.status(404).json({message: "Student not found."})
        }
        else{
            res.status(200).json(student.grades);
        }
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
}

export const getStudentGradeAvg = async (req: Request, res: Response) => {
    const {studentId} = req.params;
    try{
        const student = await userModel.findById(studentId);
        if(!student || student.role !== Role.student){
            res.status(404).json({message: "Student not found."})
        }
        else{
            const totalGrades = student.grades.reduce((acc, curr: any) => acc + curr.grade, 0);
            const avgGrades = student.grades.length > 0 ? totalGrades / student.grades.length : 0;
            res.status(200).json({average: avgGrades});
        }
    }
    catch(error:any){
        res.status(500).json({message: error.message});
    }
}

export const deleteStudent = async (req: Request, res: Response) => {
    const {studentId} = req.params;
    try{
        const student = await userModel.findByIdAndDelete({ _id: studentId, role: 'student' });
        if (!student) {
            res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({ message: "Student deleted" });
    }
     catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};