import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'textarea', 'radio', 'multiselect', 'slider']
  },
  options: [String],
  min: Number,
  max: Number,
  step: Number
});

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  media: {
    video: String,
    image: String
  },
  questions: [questionSchema]
});

export default mongoose.model('Step', stepSchema);
