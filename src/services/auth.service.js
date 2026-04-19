import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/user.model.js';
import { sendActivationEmail } from './mail.service.js';



export const registerUser = async (email, password) => {

    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
        throw new Error('User already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const activationToken = uuidv4();

    const newUser = await User.create({
        email,
        password: hashPassword,
        activationToken: activationToken
    });

    sendActivationEmail(email, activationToken);

    return newUser;

}

export const loginUser = async (email, password) => {

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error("Email and password are not valid");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Email and password are not valid");
    }

    return user;
}