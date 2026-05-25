// src/middleware/auth.ts
// Middleware to protect routes and check user authentication

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { UserRole } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Protect middleware - Verify JWT token
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.',
      });
      return;
    }

    try {
      // Verify token
      const secret = process.env.JWT_SECRET || 'default-secret-change-this';
      const decoded: any = jwt.verify(token, secret);

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User not found. Please login again.',
        });
        return;
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Authorize middleware - Check user role
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route.`,
      });
      return;
    }

    next();
  };
};