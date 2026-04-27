require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/sessions',  require('./routes/sessions'));

// Listen first so Render detects the port, then connect DB
app.listen(PORT, () => console.log(`✦ Server on port ${PORT}`));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✦ MongoDB connected'))
  .catch(err => { console.error('✦ MongoDB error:', err.message); process.exit(1); });
