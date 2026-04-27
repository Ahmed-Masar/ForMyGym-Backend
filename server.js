require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/sessions', require('./routes/sessions'));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✦ MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`✦ Server on http://localhost:${port}`));
  })
  .catch((err) => console.error('✦ Connection error:', err));
