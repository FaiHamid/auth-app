import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Token = sequelize.define('Token', {
    userId: DataTypes.INTEGER,
    refreshToken: DataTypes.STRING,
});