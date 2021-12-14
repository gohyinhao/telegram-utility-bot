const mongoose = require('mongoose');

const carInfoSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      enum: ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('CarInfo', carInfoSchema);
