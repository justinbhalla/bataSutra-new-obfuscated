const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const simpleGit = require('simple-git');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const git = simpleGit();
const DATA_FILE = path.join(__dirname, 'data', 'subscribers.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure data directory and file exist
if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// POST: Subscribe email
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  const subscribers = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  if (subscribers.includes(email)) {
    return res.status(409).json({ message: 'Email already subscribed' });
  }

  subscribers.push(email);
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2));

  try {
    await git.add(DATA_FILE);
    await git.commit(`Add subscriber: ${email}`);
    await git.push('origin', 'main'); // change to 'master' if needed

    res.status(200).json({ message: 'Subscribed and pushed to GitHub' });
  } catch (err) {
    console.error('Git push error:', err.message);
    res.status(500).json({ message: 'Subscribed, but failed to push to GitHub' });
  }
});

// GET: Export subscribers as CSV
app.get('/api/export', (req, res) => {
  const subscribers = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const data = subscribers.map(email => ({ email }));

  try {
    const csv = new Parser({ fields: ['email'] }).parse(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error('CSV export failed:', err.message);
    res.status(500).send('Failed to export CSV');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
