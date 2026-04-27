const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
  {
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const sessionExerciseSchema = new mongoose.Schema(
  {
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: [setSchema], default: [] },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    exercises: { type: [sessionExerciseSchema], default: [] },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
