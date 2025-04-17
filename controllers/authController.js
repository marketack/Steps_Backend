// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'This email is already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken
    });

    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Confirm your email address',
      html: `<p>Hello ${username},</p><p>Please <a href="${verifyLink}">click here</a> to confirm your email address and activate your account.</p><p>If you did not request this, simply ignore this email.</p>`
    });

    res.status(201).json({ message: 'Registration successful! Check your email to verify your account.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Something went wrong during registration. Please try again.' });
  }
}

export async function verifyEmail(req, res) {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    user.verified = true;
    user.verificationToken = '';
    await user.save();

    res.status(200).json({ message: 'Email verified.' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}


export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Account not found with this email.' });
    if (!user.verified) return res.status(403).json({ message: 'Please verify your email address to continue.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

    const payload = { id: user._id, isAdmin: user.isAdmin };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      token: accessToken,
      isAdmin: user.isAdmin,
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
}

export async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token provided.' });

  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = createAccessToken({ id: user.id, isAdmin: user.isAdmin });
    res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
}
