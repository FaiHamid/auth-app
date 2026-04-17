import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/models.js';
import mailService from './mail-service.js';
import tokenService from './token-service.js';

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            throw new Error(`Користувач з поштою ${email} вже існує`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationToken = uuidv4();
        const user = await User.create({ email, password: hashPassword, activationToken });

        try {
            await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationToken}`);
        } catch (e) {
            console.log('Помилка відправки листа:', e.message);
        }

        const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user };
    }

    async activate(activationToken) {
        const user = await User.findOne({ where: { activationToken } });
        if (!user) {
            throw new Error('Некоректне посилання активації');
        }
        user.isActivated = true;
        user.activationToken = null;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Користувача з таким email не знайдено');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw new Error('Невірний пароль');
        }
        const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user };
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('Відсутній Refresh Token');
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        
        const tokenFromDb = await tokenService.findToken(refreshToken);
        
        console.log("REFRESH DEBUG:", { hasUserData: !!userData, hasTokenInDb: !!tokenFromDb });

        if (!userData || !tokenFromDb) {
            throw new Error('Токен невалідний або відсутній у базі');
        }

        const user = await User.findByPk(userData.id);
        if (!user) {
            throw new Error('Користувача не знайдено');
        }

        const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { ...tokens, user };
    }
}

export default new UserService();