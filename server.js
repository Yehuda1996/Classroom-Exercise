import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/teacher', teacherRoutes);
app.use('/students', studentRoutes);
app.listen(PORT, () => {
    console.log(`Server is on and running on port ${PORT}`);
});
