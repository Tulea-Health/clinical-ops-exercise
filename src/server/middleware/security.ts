import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
  }),
];

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};
