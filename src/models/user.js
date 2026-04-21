import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    activationToken: DataTypes.STRING,
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
});