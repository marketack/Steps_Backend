import User from '../models/User.js';
import UserStep from '../models/UserStep.js';
import Step from '../models/Step.js';
import sendEmail from '../utils/sendEmail.js';

export const sendEmailToUsers = async (req, res) => {
  try {
    const { type, stepNumber, subject, message } = req.body;

    if (!subject || !message || !type) {
      return res.status(400).json({ message: 'Please provide type, subject, and message.' });
    }

    let usersToEmail = [];

    if (type === 'all') {
      usersToEmail = await User.find({}, 'email');
    } 
    
    else if (type === 'stepReached') {
      if (!stepNumber) return res.status(400).json({ message: 'stepNumber is required for stepReached.' });

      const step = await Step.findOne({ stepNumber });
      if (!step) return res.status(404).json({ message: 'Step not found.' });

      const userSteps = await UserStep.find({ step: step._id }).distinct('user');
      usersToEmail = await User.find({ _id: { $in: userSteps } }, 'email');
    } 
    
    else if (type === 'finishedAll') {
      const steps = await Step.find();
      const totalSteps = steps.length;

      const finishedUsers = await UserStep.aggregate([
        { $match: { approved: true } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $match: { count: totalSteps } }
      ]);

      const userIds = finishedUsers.map(u => u._id);
      usersToEmail = await User.find({ _id: { $in: userIds } }, 'email');
    } 
    
    else {
      return res.status(400).json({ message: 'Invalid type. Must be "all", "stepReached", or "finishedAll".' });
    }

    if (usersToEmail.length === 0) {
      return res.status(404).json({ message: 'No users found to send emails to.' });
    }

    for (const user of usersToEmail) {
      const personalizedMessage =
        type === 'finishedAll'
          ? `${message}\n\n🎉 You've successfully completed the entire program. Congratulations!`
          : message;

      await sendEmail({
        to: user.email,
        subject,
        text: personalizedMessage,
      });
    }

    res.status(200).json({
      message: `📧 Emails sent successfully to ${usersToEmail.length} user(s).`,
    });
  } catch (err) {
    console.error('❌ Error sending bulk emails:', err);
    res.status(500).json({ message: 'Failed to send bulk emails.' });
  }
};

export const submitUserStep = async (req, res) => {
  try {
    const { stepId, answers } = req.body;
    const existing = await UserStep.findOne({ user: req.user.id, step: stepId });

    if (existing) {
      return res.status(400).json({ message: 'Step already submitted.' });
    }

    const step = await Step.findById(stepId);
    if (!step) return res.status(404).json({ message: 'Step not found' });

    const submission = await UserStep.create({
      user: req.user.id,
      step: stepId,
      answers,
    });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await UserStep.find({ user: req.user.id }).populate('step');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await UserStep.find()
      .populate('user', 'email username') // ← include username here
      .populate('step', 'stepNumber title');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const approveSubmission = async (req, res) => {
  try {
    const updated = await UserStep.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
      .populate('user', 'email')
      .populate('step', 'title');

    // ✅ Send Email
    await sendEmail({
      to: updated.user.email,
      subject: '✅ Your step submission was approved!',
      text: `Congratulations! Your submission for "${updated.step.title}" was approved.`,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const declineSubmission = async (req, res) => {
  try {
    const updated = await UserStep.findByIdAndUpdate(req.params.id, { approved: false }, { new: true })
      .populate('user', 'email')
      .populate('step', 'title');

    // ❌ Send Email
    await sendEmail({
      to: updated.user.email,
      subject: '❌ Your step submission was declined',
      text: `Unfortunately, your submission for "${updated.step.title}" was declined. Please review and try again.`,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSubmissionsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const submissions = await UserStep.find({ user: user._id })
      .populate('step', 'title stepNumber approved');

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};