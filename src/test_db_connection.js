
import sequelize from "./db.js";

export async function testDbConnection() {

    try {

        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Database connection established successfully.');
    } catch (error) {

        console.error('Unable to connect to the database:', error);
    }
}