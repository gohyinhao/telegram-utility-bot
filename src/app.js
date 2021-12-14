require('dotenv').config();
const mongoose = require('mongoose');

/**
 * DB CONFIG
 */
mongoose.connect(process.env.MONGODB_URL);

/**
 * MODULES
 */
require('./modules/index');

/**
 * ON LAUNCH LOGIC
 */
require('./modules/reminder/onLaunch');
