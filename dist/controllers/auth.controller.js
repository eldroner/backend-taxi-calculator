"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("../services/email.service"); // Import the email service
// Existing registerUser and loginUser functions...
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const userExists = yield user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = yield user_model_1.default.create({
            email,
            password,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                token: jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (user && (yield user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' }),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.loginUser = loginUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        // Always send a generic success message to prevent email enumeration
        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        // Set token and expiration date
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        yield user.save();
        // Create reset URL
        const resetUrl = `https://taxi-config.pixelnova.es/reset-password?token=${resetToken}`;
        // Email content
        const emailHtml = `
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Por favor, haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Si no has sido tú, por favor ignora este email.</p>
    `;
        yield (0, email_service_1.sendEmail)({
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
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        // Find user by token and check if token has not expired
        const user = yield user_model_1.default.findOne({
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
        yield user.save();
        // Optional: Log the user in directly by sending back a new JWT token
        const jwtToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
        res.status(200).json({
            message: 'Password has been reset successfully.',
            token: jwtToken, // Send a new token for immediate login
            _id: user._id,
            email: user.email,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.resetPassword = resetPassword;
