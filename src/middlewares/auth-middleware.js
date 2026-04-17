import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Користувач не авторизований (немає заголовка)' });
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: 'Користувач не авторизований (немає токена)' });
        }
        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET || 'access-secret');
        
        req.user = userData;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Користувач не авторизований (токен невалідний)' });
    }
};