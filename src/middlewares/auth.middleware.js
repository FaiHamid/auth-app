import jwt from 'jsonwebtoken';


export default function authMiddleware(req, res, next) {

    try {

        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const authToken = authorizationHeader.split(' ')[1];

        if (!authToken) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const payload = jwt.verify(authToken, process.env.JWT_SECRET);

        req.user = payload;

        next();

    } catch (error) {

        console.error("Auth error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}