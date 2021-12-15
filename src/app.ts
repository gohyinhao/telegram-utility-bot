import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

/**
 * DB CONFIG
 */
mongoose.connect(process.env.MONGODB_URL || '');

/**
 * MODULES
 */
import './modules';

/**
 * ON LAUNCH LOGIC
 */
import './modules/reminder/onLaunch';
