import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import User from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Email Server Connection Failed:", error);
  } else {
    console.log("Email Server is ready to take our messages");
  }
});

const generateToken = (user: any) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
};

// 1. REGISTER (Modified for OTP)
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // IF CUSTOMER: Create immediately
    if (role !== 'ADMIN') {
      const user = await User.create({ email, password: hashedPassword, role: 'CUSTOMER' });
      const token = generateToken(user);
      return res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    }

    // IF ADMIN: Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create user but save OTP (we will verify later)
    // NOTE: In a real app, you might verify OTP *before* creating the user document.
    // Here, we create it but you could add an 'isVerified' flag if you wanted strictness.
    await User.create({ 
      email, 
      password: hashedPassword, 
      role: 'ADMIN',
      otp,
      otpExpires
    });

    // Send OTP to the SPECIFIC Admin Email
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: 'inderkiranbhamra2003@gmail.com', // Hardcoded security gate
      subject: 'ADMIN REGISTRATION OTP',
      text: `Someone (Email: ${email}) is trying to register as Admin. OTP: ${otp}`
    });

    return res.status(202).json({ message: 'OTP_SENT', email });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. VERIFY OTP (New)
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. LOGIN (Existing)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. GOOGLE LOGIN
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body; // Google sends "credential", not "idToken" usually
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: 'Invalid Token' });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        googleId: payload.sub,
        role: 'CUSTOMER' // Default to Customer for Google Auth
      });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: 'Google Auth Failed' });
  }
};