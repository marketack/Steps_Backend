import mongoose from 'mongoose';

const userStepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  step: { type: mongoose.Schema.Types.ObjectId, ref: 'Step' },
  answers: [String],
  approved: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('UserStep', userStepSchema);
