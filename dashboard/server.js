require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { loadData, saveData } = require('./lib/mongodb');
const { prepareForStorage } = require('./lib/supabase-storage');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;

if (!JWT_SECRET) throw new Error('Missing JWT_SECRET environment variable.');
if (!ADMIN_PASS_HASH && !process.env.ADMIN_PASS) {
  throw new Error('Set ADMIN_PASS_HASH (recommended) or ADMIN_PASS.');
}
const passwordHash = ADMIN_PASS_HASH || bcrypt.hashSync(process.env.ADMIN_PASS, 10);

app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));

function requireAuth(req, res, next) {
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ error: 'Not logged in' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired, please log in again.' });
  }
}

app.get('/api/session', (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.json({ loggedIn: false });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ loggedIn: true, username: user.username });
  } catch {
    res.json({ loggedIn: false });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  if (username !== ADMIN_USER || !bcrypt.compareSync(password, passwordHash)) {
    return res.status(401).json({ error: 'Incorrect username or password.' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  res.json({ ok: true, username });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ ok: true });
});

app.get('/api/data', async (req, res) => {
  try { res.json(await loadData()); }
  catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
});

app.put('/api/data', requireAuth, async (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return res.status(400).json({ error: 'Invalid data payload.' });
  }
  try {
    await saveData(incoming);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to save data.' });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const { pingDatabase, getDbName } = require('./lib/mongodb');
    await pingDatabase();
    res.json({ ok: true, database: getDbName() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use(express.static(require('path').join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Dashboard server running at http://localhost:${PORT}`));
