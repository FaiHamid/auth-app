import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import User from './user.model.js';

export const Token = sequelize.define('token', {
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Token.belongsTo(User);
User.hasOne(Token);