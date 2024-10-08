var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel from "../models/userModel.js";
export const getMyGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userModel.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        else {
            res.status(200).json({ grades: user.grades, success: true });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});
export const getAverageGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userModel.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        else {
            const grades = user.grades.map(g => g.grade);
            const avg = grades.length ? grades.reduce((acc, grade) => acc + grade, 0) / grades.length : 0;
            res.status(200).json({ avg });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});
