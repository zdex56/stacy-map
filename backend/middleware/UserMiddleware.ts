import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';



function UserMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'где токен' });
    }

    

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            console.error(' ошибка верификации:', err.message); 
            return res.status(403).json({ message: 'ошибка middleware' });
        }
        req.user = user as { user_id: number; name: string };
        next();
    });
}


export default UserMiddleware;
