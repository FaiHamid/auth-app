import { Token } from '../models/token.js';
import jwt from 'jsonwebtoken';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '5m',
        });

        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return Token.create({ userId, refreshToken });
    }

    async removeToken(refreshToken) {
        return Token.destroy({ where: { refreshToken } });
    }

    async findToken(refreshToken) {
        return Token.findOne({ where: { refreshToken } });
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch {
            return null;
        }
    }
}

export default new TokenService();