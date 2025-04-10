import UserStep from '../models/UserStep.js';
import Step from '../models/Step.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// ✅ Submit user step
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

// ✅ Get current user's submissions
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await UserStep.find({ user: req.user.id }).populate('step');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: get all user submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await UserStep.find()
      .populate('user', 'email username')
      .populate('step', 'stepNumber title');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: approve submission with final step logic
export const approveSubmission = async (req, res) => {
  try {
    const updated = await UserStep.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
      .populate('user', 'email username')
      .populate('step', 'title stepNumber');

    const totalSteps = await Step.countDocuments();
    const isFinalStep = updated.step.stepNumber === totalSteps;

    const emailOptions = isFinalStep
      ? {
          to: updated.user.email,
          subject: '🎉 You’ve completed all steps!',
          text: `Hi ${updated.user.username || ''},\n\nCongratulations! You've successfully completed all the program steps. 🎓👏`
        }
      : {
          to: updated.user.email,
          subject: '✅ Step Approved',
          text: `Hi ${updated.user.username || ''},\n\nYour submission for "${updated.step.title}" has been approved. Keep going!`
        };

    await sendEmail(emailOptions);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Admin: decline submission
export const declineSubmission = async (req, res) => {
  try {
    const updated = await UserStep.findByIdAndUpdate(req.params.id, { approved: false }, { new: true })
      .populate('user', 'email')
      .populate('step', 'title');

    await sendEmail({
      to: updated.user.email,
      subject: '❌ Step Declined',
      text: `Hi,\n\nUnfortunately, your submission for "${updated.step.title}" was declined. Please review and try again.`
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin: get user submissions by email
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

// ✅ Admin: send email to segmented users
export const sendEmailToUsers = async (req, res) => {
  const { type, message, subject, stepNumber } = req.body;

  try {
    let users = [];

    if (type === 'all') {
      users = await User.find({}, 'email username');
    } else if (type === 'stepReached') {
      const step = await Step.findOne({ stepNumber });
      const submissions = await UserStep.find({ step: step._id, approved: true }).populate('user', 'email username');
      users = submissions.map(s => s.user);
    } else if (type === 'finishedAll') {
      const totalSteps = await Step.countDocuments();
      const userIds = await UserStep.aggregate([
        { $match: { approved: true } },
        { $group: { _id: '$user', count: { $sum: 1 } } },
        { $match: { count: totalSteps } }
      ]);
      users = await User.find({ _id: { $in: userIds.map(u => u._id) } }, 'email username');
    }

    for (let user of users) {
      await sendEmail({
        to: user.email,
        subject: subject || '📢 Notification from Admin',
        text: `Hi ${user.username || ''},\n\n${message}`
      });
    }

    res.json({ message: `✅ Email sent to ${users.length} user(s)` });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to send emails', error: err.message });
  }
};
