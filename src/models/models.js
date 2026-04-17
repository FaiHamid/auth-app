import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

export const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    activationToken: { type: DataTypes.STRING },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export const Token = sequelize.define('token', {
    refreshToken: { type: DataTypes.TEXT, allowNull: false },
});

User.hasOne(Token);
Token.belongsTo(User);