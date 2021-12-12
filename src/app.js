import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// ============================
// DATABASE
// ============================
mongoose.connect(process.env.MONGODB_URL);

// ============================
// EVENT LISTENERS
// ============================
import runBotCommands from './listeners/index.js';
runBotCommands();
