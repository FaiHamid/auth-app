import authService from '../services/authService.js';
import tokenService from '../services/tokenService.js';

class AuthController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await authService.registration(email, password);
            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await authService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
            });

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(400).json({ message: 'No token' });
            }

            await tokenService.removeToken(refreshToken);

            res.clearCookie('refreshToken');
            res.json({ message: 'Logged out' });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const userData = await authService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
            });

            res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const { activationToken } = req.params;
            await authService.activate(activationToken);

            res.json({ message: 'Account activated' });
        } catch (e) {
            next(e);
        }
    }
}

export default new AuthController();