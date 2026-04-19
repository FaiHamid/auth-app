
import express from 'express';
import dotenv from 'dotenv';
import { testDbConnection } from './test_db_connection.js';
import router from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

testDbConnection();

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
