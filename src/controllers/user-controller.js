import userService from '../services/user-service.js';

class UserController {
    async registration(req, res) {
        try {
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });

            return res.json(userData);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async activate(req, res) {
        try {
            const activationToken = req.params.activationToken;
            await userService.activate(activationToken);
            return res.redirect(process.env.CLIENT_URL || 'http://localhost:3000');
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { 
                maxAge: 30 * 24 * 60 * 60 * 1000, 
                httpOnly: true 
            });
            return res.json(userData);
        } catch (e) {
            res.status(401).json({ message: 'Refresh error' });
        }
    }
}

export default new UserController();