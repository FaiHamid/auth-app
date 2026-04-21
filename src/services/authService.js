import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';

class AuthService {
    async registration(email, password) {
        const candidate = await User.findOne({ where: { email } });
        if (candidate) throw new Error('User already exists');

        const hashPassword = await bcrypt.hash(password, 5);
        const activationToken = uuidv4();

        const user = await User.create({
            email,
            password: hashPassword,
            activationToken,
        });

        const link = `${process.env.HOST}/api/activate/${activationToken}`;
        await mailService.sendActivationMail(email, link);

        return user;
    }

    async activate(activationToken) {
        const user = await User.findOne({ where: { activationToken } });
        if (!user) throw new Error('Invalid activation link');

        user.isActivated = true;
        user.activationToken = null;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) throw new Error('User not found');

        if (!user.isActivated) throw new Error('Activate account first');

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) throw new Error('Wrong password');

        const tokens = tokenService.generateTokens({
            id: user.id,
            email: user.email,
        });

        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { user, ...tokens };
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw new Error('No token');

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw new Error('Unauthorized');
        }

        const user = await User.findByPk(userData.id);

        const tokens = tokenService.generateTokens({
            id: user.id,
            email: user.email,
        });

        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { user, ...tokens };
    }
}

export default new AuthService();