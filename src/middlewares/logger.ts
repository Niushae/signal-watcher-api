
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';

const logger = pino();

export const requestLogger = (
  req: Request & { id?: string },
  res: Response,
  next: NextFunction
) => {
  req.id = uuidv4();
    logger.info({
        correlationId: req.id,
        method: req.method,
        url: req.originalUrl,
        message: 'Request started',
    });
  next();
};

export const responseLogger = (req: Request & { id?: string }, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        logger.info({
            correlationId: req.id,
            statusCode: res.statusCode,
            message: 'Request finished',
        });
    });
    next();
};
