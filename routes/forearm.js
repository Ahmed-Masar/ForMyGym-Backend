const router = require('express').Router();
const ForearmLog = require('../models/ForearmLog');

function startOfDay(input) {
  const d = new Date(input);
  d.setHours(0, 0, 0, 0);
  return d;
}

function computeStreak(logs) {
  // logs must only include days with at least one logged set
  const days = new Set(logs.map((log) => startOfDay(log.date).getTime()));
  const cursor = startOfDay(new Date());

  // today not logged yet shouldn't break a streak built on previous days
  if (!days.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (days.has(cursor.getTime())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

router.get('/', async (req, res) => {
  try {
    const logs = await ForearmLog.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/streak', async (req, res) => {
  try {
    const logs = await ForearmLog.find({ 'exercises.sets.0': { $exists: true } }).sort({ date: -1 });
    res.json({ streak: computeStreak(logs) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/date/:date', async (req, res) => {
  try {
    const log = await ForearmLog.findOne({ date: startOfDay(req.params.date) });
    res.json(log || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const date = startOfDay(req.body.date || new Date());
    const log = await ForearmLog.findOneAndUpdate(
      { date },
      { date, exercises: req.body.exercises || [] },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await ForearmLog.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
