import express from 'express';
import { verifyToken , checkRole} from '../middleware/authMiddleware.js';
import {
     addGrade,
     editGrade, 
     deleteGrade, 
     getAllUsers, 
     getStudentsGrades, 
     getStudentGradeAvg, 
     deleteStudent  
} from '../controllers/teacherController.js';

const router = express.Router();

router.get('/users', verifyToken, checkRole(['teacher']), getAllUsers);
router.route('/grade').post(verifyToken, checkRole(['teacher']), addGrade).put(verifyToken, checkRole(['teacher']), editGrade);
router.delete('/grade/delete', verifyToken, checkRole(['teacher']), deleteGrade);
router.get('/student/:studentId/grades', verifyToken, checkRole(['teacher']), getStudentsGrades);
router.get('/student/:studentId/average', verifyToken, checkRole(['teacher']), getStudentGradeAvg);
router.delete('/student/:studentId', verifyToken, checkRole(['teacher']), deleteStudent);

export default router;
