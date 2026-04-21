import tokenService from '../services/tokenService.js';

export default function (req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'No token' });
    }

    const token = header.split(' ')[1];
    const user = tokenService.validateAccessToken(token);

    if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
}