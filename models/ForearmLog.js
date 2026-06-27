const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
  {
    reps: { type: Number, required: true, min: 1 },
    weight: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const FOREARM_EXERCISES = ['Extensors', 'Flexors', 'Brachioradialis'];

const forearmExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, enum: FOREARM_EXERCISES },
    sets: { type: [setSchema], default: [] },
  },
  { _id: false }
);

const forearmLogSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    exercises: { type: [forearmExerciseSchema], default: [] },
  },
  { timestamps: true }
);

const ForearmLog = mongoose.model('ForearmLog', forearmLogSchema);
ForearmLog.EXERCISES = FOREARM_EXERCISES;

module.exports = ForearmLog;
