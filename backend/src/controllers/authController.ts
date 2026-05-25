// src/controllers/authController.ts
// Handles user registration, login, and authentication

import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user';
import { RegisterRequest, AuthRequest, GoogleAuthRequest } from '../types';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone }: RegisterRequest = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'tourist',
      phone,
    });

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: AuthRequest = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
      return;
    }

    // Find user by email (include password and authProvider for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if user registered with Google OAuth (no password set)
    if (user.authProvider === 'google' && !user.password) {
      res.status(401).json({
        success: false,
        message: 'This account uses Google Sign-In. Please click "Continue with Google" to log in.',
      });
      return;
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get current logged-in user
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        isApproved: user.isApproved,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Logout user
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// Google OAuth — verify token and sign in or register
// Supports both Google ID tokens and access tokens
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential }: GoogleAuthRequest = req.body;

    if (!credential) {
      res.status(400).json({
        success: false,
        message: 'Google credential token is required',
      });
      return;
    }

    let googleId: string | undefined;
    let email: string | undefined;
    let name: string | undefined;
    let picture: string | undefined;

    // Try 1: Verify as ID token (from GoogleLogin component)
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (payload) {
        googleId = payload.sub;
        email = payload.email;
        name = payload.name;
        picture = payload.picture;
      }
    } catch (idTokenErr) {
      // Not a valid ID token — try as access token
    }

    // Try 2: Use as access token (from useGoogleLogin hook)
    if (!email) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${credential}` },
        });
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json() as any;
          googleId = userInfo.sub;
          email = userInfo.email;
          name = userInfo.name;
          picture = userInfo.picture;
        }
      } catch (accessTokenErr) {
        // Also failed
      }
    }

    if (!email) {
      res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      });
      return;
    }

    // Check if we already have a user with this Google ID
    let user = googleId ? await User.findOne({ googleId }) : null;

    if (!user) {
      // Check if a user with this email exists (registered via email/password)
      user = await User.findOne({ email });

      if (user) {
        // Link the Google account to the existing user
        user.googleId = googleId;
        user.authProvider = 'google';
        if (!user.avatar && picture) user.avatar = picture;
        user.isEmailVerified = true;
        await user.save();
      } else {
        // Create a brand-new user via Google
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          authProvider: 'google',
          avatar: picture || '',
          isEmailVerified: true,
          role: 'tourist',
        });
      }
    }

    // Generate JWT
    const token = user.generateAuthToken();

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isApproved: user.isApproved,
    };

    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during Google authentication',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};