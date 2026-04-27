const router = require('express').Router();
const Session = require('../models/Session');

router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate('exercises.exercise')
      .sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/prs', async (req, res) => {
  try {
    const sessions = await Session.find().populate('exercises.exercise');
    const map = {};
    for (const session of sessions) {
      for (const ex of session.exercises) {
        if (!ex.exercise) continue;
        const id = ex.exercise._id.toString();
        const max = Math.max(...ex.sets.map((s) => s.weight));
        if (!map[id] || max > map[id].weight) {
          map[id] = {
            exerciseId: id,
            name: ex.exercise.name,
            category: ex.exercise.category,
            weight: max,
            date: session.date,
          };
        }
      }
    }
    res.json(Object.values(map).sort((a, b) => b.weight - a.weight));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/exercise/:exerciseId', async (req, res) => {
  try {
    const sessions = await Session.find({
      'exercises.exercise': req.params.exerciseId,
    }).sort({ date: 1 });

    const data = sessions.map((session) => {
      const ex = session.exercises.find(
        (e) => e.exercise.toString() === req.params.exerciseId
      );
      const maxWeight = Math.max(...ex.sets.map((s) => s.weight));
      const volume = ex.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
      return { date: session.date, maxWeight, volume, sets: ex.sets };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      'exercises.exercise'
    );
    if (!session) return res.status(404).json({ error: 'Not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const session = await Session.create(req.body);
    const populated = await session.populate('exercises.exercise');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('exercises.exercise');
    if (!session) return res.status(404).json({ error: 'Not found' });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
