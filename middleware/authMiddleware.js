import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    var _a;
    const token = req.cookies.auth_token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    if (!token) {
        res.status(403).json({ message: "No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded;
        }
        else {
            res.status(401).json({ message: "Invalid token." });
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Access denied." });
        }
        next();
    };
};
