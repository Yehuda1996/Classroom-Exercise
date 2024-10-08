import express from 'express';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
import { getMyGrades, getAverageGrade } from '../controllers/studentController.js';
const router = express.Router();
router.get('/grades', verifyToken, checkRole(['student']), getMyGrades);
router.get('/grades/average', verifyToken, checkRole(['student']), getAverageGrade);
export default router;
