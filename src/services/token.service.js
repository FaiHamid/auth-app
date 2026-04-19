import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Token } from '../models/token.model.js';

dotenv.config();

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
}
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export const saveRefreshToken = async (user, refreshToken) => {

    const UserId = user.id;
    const tokenData = await Token.findOne({ where: { UserId } });

    if (tokenData) {

        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }

    const token = await Token.create({
        UserId,
        refreshToken
    });

    return token;
}