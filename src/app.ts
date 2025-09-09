import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api/events', eventRoutes);

app.use(errorHandler);

export default app;