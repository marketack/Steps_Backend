import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString('hex');

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
      subject: 'Verify your email',
      html: `<p>Hi ${username},</p><p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`
    });

    res.status(201).json({ message: 'Registration successful. Please check your email to verify.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

export async function verifyEmail(req, res) {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.verified = true;
    user.verificationToken = '';
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/verified`);
  } catch (err) {
    res.status(500).json({ message: 'Server error during verification' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.verified) return res.status(403).json({ message: 'Please verify your email first.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({
      token,
      isAdmin: user.isAdmin,
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
}
