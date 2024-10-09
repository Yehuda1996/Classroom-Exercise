var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel, { Role } from "../models/userModel.js";
export const addGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, subject, grade } = req.body;
    try {
        const student = yield userModel.findById(studentId);
        if (!student || student.role !== Role.student) {
            res.status(404).json({ message: "Student not found." });
        }
        else {
            const gradeExists = student.grades.some(g => g.subject === subject);
            if (gradeExists) {
                res.status(400).json({ message: "Grade for this subject exists already" });
            }
            student.grades.push({ subject, grade });
            yield student.save();
            res.status(201).json({ message: "Grade added.", grades: student.grades });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const editGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, subject, grade } = req.body;
    try {
        const student = yield userModel.findById(studentId);
        if (!student || student.role !== Role.student) {
            res.status(404).json({ message: "Student not found." });
        }
        else {
            const gradeIndex = student.grades.findIndex(g => g.subject === subject);
            if (gradeIndex === -1) {
                res.status(404).json({ message: "Grade for this subject not found" });
            }
            student.grades[gradeIndex].grade = grade;
            yield student.save();
            res.status(200).json({ message: "Graded updated", grades: student.grades });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const deleteGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId, subject } = req.body;
    try {
        const student = yield userModel.findById(studentId);
        if (!student || student.role !== Role.student) {
            res.status(404).json({ message: "Student not found." });
        }
        else {
            const gradeIndex = student.grades.findIndex(g => g.subject === subject);
            if (gradeIndex === -1) {
                res.status(404).json({ message: "Grade for this subject not found" });
            }
            student.grades.splice(gradeIndex, 1);
            yield student.save();
            res.status(200).json({ message: "Grade deleted", grades: student.grades });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getStudentsGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    try {
        const student = yield userModel.findById(studentId);
        if (!student || student.role !== Role.student) {
            res.status(404).json({ message: "Student not found." });
        }
        else {
            res.status(200).json(student.grades);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const getStudentGradeAvg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    try {
        const student = yield userModel.findById(studentId);
        if (!student || student.role !== Role.student) {
            res.status(404).json({ message: "Student not found." });
        }
        else {
            const totalGrades = student.grades.reduce((acc, curr) => acc + curr.grade, 0);
            const avgGrades = student.grades.length > 0 ? totalGrades / student.grades.length : 0;
            res.status(200).json({ average: avgGrades });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentId } = req.params;
    try {
        const student = yield userModel.findByIdAndDelete({ _id: studentId, role: 'student' });
        if (!student) {
            res.status(404).json({ message: "Student not found." });
        }
        res.status(200).json({ message: "Student deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
