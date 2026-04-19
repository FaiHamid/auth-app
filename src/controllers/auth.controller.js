
import { registerUser, loginUser } from '../services/auth.service.js';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, saveRefreshToken, verifyRefreshToken } from '../services/token.service.js';
import { Token } from '../models/token.model.js';


export const register = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        const userData = await registerUser(email, password);

        return res.status(201).json(userData);

    } catch (error) {

        console.log(error.message);

        if (error.message == 'User already exists') {
            return res.status(409).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await loginUser(email, password);

        const payload = {
            id: user.id,
            email: user.email
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await saveRefreshToken(user, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });

        res.status(200).send({
            user: user,
            accessToken: accessToken
        });

    } catch (error) {

        console.log(error.message);

        if (error.message == "Email and password are required") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message == "Email and password are not valid") {
            return res.status(401).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const activate = async (req, res) => {

    const activationToken = req.params.activationToken;

    try {

        const activationUser = await User.findOne({ where: { activationToken } });

        if (!activationUser) {
            return res.status(400).json({ message: "Invalid activation link" });
        }

        activationUser.isActivated = true;
        activationUser.activationToken = null;
        await activationUser.save();

        res.status(200).json({ message: "User successfully activated!" });

    } catch (error) {

        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const refresh = async (req, res) => {

    try {

        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const payload = verifyRefreshToken(refreshToken);
        delete payload.exp;

        const token = await Token.findOne({ where: { refreshToken } });

        if (!token) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        const user = await User.findOne({ where: { id: payload.id } });

        await saveRefreshToken(user, newRefreshToken);

        res.cookie('refreshToken', newRefreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });

        return res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {

        console.log(error.message);
        return res.status(401).json({ message: "User is not authorized" });
    }
}

export const logout = async (req, res) => {

    try {

        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        const token = await Token.findOne({ where: { refreshToken } });

        if (!token) {
            return res.status(401).json({ message: "User is not authorized" });
        }

        await token.destroy();

        res.clearCookie('refreshToken');

        return res.status(200).json({ message: "User successfully logged out" });

    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: "User is not authorized" });
    }
}

export const getUsers = async (req, res) => {

    try {

        const users = await User.findAll();
        return res.status(200).json(users);

    } catch (error) {

        console.log("Get users error: " + error.message);
        return res.status(500).json({ message: "Error getting all users" });
    }
}