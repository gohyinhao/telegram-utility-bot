require('dotenv').config();
const mongoose = require('mongoose');

// ============================
// DATABASE
// ============================
mongoose.connect(process.env.MONGODB_URL);

// ============================
// MODULES
// ============================
require('./modules/index');
