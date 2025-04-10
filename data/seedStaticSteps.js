import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Step from '../models/Step.js';
import { staticSteps } from './staticSteps.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to DB');
    const count = await Step.countDocuments();
    if (count === 0) {
      await Step.insertMany(staticSteps);
      console.log('🌱 Static steps seeded.');
    } else {
      console.log('⚠️ Steps already exist. Skipped seeding.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ DB Error:', err);
    process.exit(1);
  });
