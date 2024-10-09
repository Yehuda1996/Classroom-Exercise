import jwt, {JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(403).json({message: "No token provided."})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded as JwtPayload; 
        } else {
            res.status(401).json({ message: "Invalid token." });
        }
        next();
    }
    catch(error){
        res.status(401).json({message: "Unauthorized"});
    }
};

export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) { 
            res.status(403).json({ message: "Access denied." });
        }
        next(); 
    };
};
