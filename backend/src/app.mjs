import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.mjs';
import errorHandler from './error-handler.mjs';
import router from './routes/tasks.routes.mjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
connectDB();

// API routes
app.use('/api/tasks', router);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
