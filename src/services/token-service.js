import jwt from 'jsonwebtoken';
import { Token } from '../models/models.js';

class TokenService {
    generateTokens(payload) {
        const accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

        const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({ userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ where: { refreshToken } });
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret');
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: { refreshToken } });
        return tokenData;
    }
}

export default new TokenService();