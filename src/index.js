import dotenv from 'dotenv';
import app from './app.js';
import { sequelize } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();