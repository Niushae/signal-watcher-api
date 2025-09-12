import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger, responseLogger } from './middlewares/logger.js'

const app = express();

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(requestLogger);
app.use(responseLogger);

app.use('/api/events', eventRoutes);
app.use('/api/watchlists', watchlistRoutes);

app.use(errorHandler);

export default app;