const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Other', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
