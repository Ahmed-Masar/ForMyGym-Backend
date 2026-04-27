const mongoose = require('mongoose');
const Exercise = require('./models/Exercise');

const MONGO_URI = 'mongodb+srv://ahmedmasar1400_db_user:XQIj0mJW3ppiICQ5@cluster0.p8o4dt5.mongodb.net/forge';

const exercises = [
  // Day 1 — Chest, Biceps & Forearms
  { name: 'Flat Hammer Chest Press',     category: 'Chest' },
  { name: 'Incline Hammer Chest Press',  category: 'Chest' },
  { name: 'Machine Decline Chest Press', category: 'Chest' },
  { name: 'Pec Deck Machine',            category: 'Chest' },
  { name: 'Larry Scott Curl',            category: 'Arms'  },
  { name: 'Incline Dumbbell Curl',       category: 'Arms'  },
  { name: 'Hammer Curl',                 category: 'Arms'  },
  { name: 'Wrist Curls',                 category: 'Arms'  },

  // Day 2 — Back & Triceps
  { name: 'Lat Pulldown',                    category: 'Back' },
  { name: 'Close-Grip Seated Cable Row',     category: 'Back' },
  { name: 'T-Bar Row',                       category: 'Back' },
  { name: 'Back Extension',                  category: 'Back' },
  { name: 'Triceps Pushdown Machine',        category: 'Arms' },
  { name: 'Triceps Extension Machine',       category: 'Arms' },
  { name: 'Low Pulley Overhead Extension',   category: 'Arms' },
  { name: 'Triceps Rope Pushdown',           category: 'Arms' },

  // Day 3 — Shoulders, Traps & Forearms
  { name: 'Machine Shoulder Press', category: 'Shoulders' },
  { name: 'Dumbbell Lateral Raise', category: 'Shoulders' },
  { name: 'Cable Lateral Raise',    category: 'Shoulders' },
  { name: 'Reverse Pec Deck Fly',   category: 'Shoulders' },
  { name: 'Dumbbell Shrugs',        category: 'Shoulders' },
  { name: 'Reverse Barbell Curl',   category: 'Arms'      },

  // Day 4 — Legs
  { name: 'Leg Press',            category: 'Legs' },
  { name: 'Hip Adductor Machine', category: 'Legs' },
  { name: 'Hip Abductor Machine', category: 'Legs' },
  { name: 'Lying Leg Curl',       category: 'Legs' },
  { name: 'Calf Raises',          category: 'Legs' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  let added = 0, skipped = 0;

  for (const ex of exercises) {
    const exists = await Exercise.findOne({ name: ex.name });
    if (exists) {
      console.log(`  skip  — ${ex.name}`);
      skipped++;
    } else {
      await Exercise.create(ex);
      console.log(`  added — ${ex.name} [${ex.category}]`);
      added++;
    }
  }

  console.log(`\nDone: ${added} added, ${skipped} already existed`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
