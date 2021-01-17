require('dotenv').config();
const mongoose = require('mongoose');

// ============================
// DATABASE
// ============================
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// ============================
// EVENT LISTENERS
// ============================
require('./listeners');
require('./listeners/boba');
require('./listeners/car');
require('./listeners/fisi');
require('./listeners/lunch');
require('./listeners/rubbish');
