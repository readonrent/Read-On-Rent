const { login, setSessionCookie } = require('../lib/auth');
module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  const token = login(username, password);
  if (!token) return res.status(401).json({ error: 'Incorrect username or password.' });
  setSessionCookie(res, token);
  res.status(200).json({ ok: true, username });
};
