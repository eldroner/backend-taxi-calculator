import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../services/email.service'; // Import the email service

// Existing registerUser and loginUser functions...

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  }
  catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  }
  catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Always send a generic success message to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set token and expiration date
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    // Create reset URL
    const resetUrl = `https://taxi-config.pixelnova.es/reset-password?token=${resetToken}`;

    // Email content
    const emailHtml = `
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Por favor, haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no has sido tú, por favor ignora este email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Restablecimiento de contraseña - Taxi Calculator',
      html: emailHtml,
    });

    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

  }
  catch (error) {
    console.error('Error in forgotPassword controller:', error);
    // Do not reveal internal errors to the client for this endpoint
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  try {
    // Find user by token and check if token has not expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    // Set the new password
    user.password = password;
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // The pre-save hook in user.model.ts will automatically hash the new password
    await user.save();

    // Optional: Log the user in directly by sending back a new JWT token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    res.status(200).json({
      message: 'Password has been reset successfully.',
      token: jwtToken, // Send a new token for immediate login
      _id: user._id,
      email: user.email,
    });

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
