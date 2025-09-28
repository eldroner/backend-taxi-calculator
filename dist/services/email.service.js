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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
// Check if all required environment variables are set
if (!SENDER_EMAIL || !SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('SMTP environment variables are not fully set. Email functionality will be disabled.');
    // You might want to throw an error here in a real production environment
    // throw new Error('SMTP configuration missing.');
}
const transporter = nodemailer_1.default.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: options.from || `"Taxi Calculator" <${SENDER_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
