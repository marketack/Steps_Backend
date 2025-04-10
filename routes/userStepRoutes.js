import express from 'express';
import {
  submitUserStep,
  getMySubmissions,
  getAllSubmissions,
  approveSubmission,
  declineSubmission,
  getSubmissionsByEmail,
  sendEmailToUsers
} from '../controllers/userStepController.js';

import Step from '../models/Step.js';
import auth from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/user-steps
 * @desc    Submit a step answer (user only)
 * @access  Private
 */
router.post('/', auth, submitUserStep);

/**
 * @route   GET /api/user-steps/my
 * @desc    Get current user's step submissions
 * @access  Private
 */
router.get('/my', auth, getMySubmissions);

/**
 * @route   GET /api/user-steps/steps
 * @desc    Get all static steps
 * @access  Private
 */
router.get('/steps', auth, async (req, res) => {
  try {
    const steps = await Step.find().sort({ stepNumber: 1 });
    res.json(steps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load steps' });
  }
});

// 🔒 Admin Routes

/**
 * @route   GET /api/user-steps/all
 * @desc    Admin: view all user submissions
 * @access  Private/Admin
 */
router.get('/all', auth, admin, getAllSubmissions);

/**
 * @route   PATCH /api/user-steps/:id/approve
 * @desc    Admin: approve a user step
 * @access  Private/Admin
 */
router.patch('/:id/approve', auth, admin, approveSubmission);

/**
 * @route   PATCH /api/user-steps/:id/decline
 * @desc    Admin: decline a user step
 * @access  Private/Admin
 */
router.patch('/:id/decline', auth, admin, declineSubmission);

/**
 * @route   GET /api/user-steps/by-email?email=user@example.com
 * @desc    Admin: Get user submissions by email
 * @access  Private/Admin
 */
router.get('/by-email', auth, admin, getSubmissionsByEmail);

/**
 * @route   POST /api/user-steps/send-email
 * @desc    Admin: Send email to all users / users who reached specific step / completed all
 * @access  Private/Admin
 * @body    { type: 'all' | 'stepReached' | 'finishedAll', stepNumber?, message, subject }
 */
router.post('/send-email', auth, admin, sendEmailToUsers);

export default router;
