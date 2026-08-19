const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;

if (!JWT_SECRET) throw new Error('Missing JWT_SECRET environment variable.');
if (!ADMIN_PASS_HASH && !process.env.ADMIN_PASS) throw new Error('Set ADMIN_PASS_HASH (recommended) or ADMIN_PASS.');

const passwordHash = ADMIN_PASS_HASH || bcrypt.hashSync(process.env.ADMIN_PASS, 10);

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(header.split(';').filter(Boolean).map(part => {
    const i = part.indexOf('=');
    return [part.slice(0, i).trim(), decodeURIComponent(part.slice(i + 1).trim())];
  }));
}

function getUser(req) {
  const token = parseCookies(req).session;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', [
    `session=${encodeURIComponent(token)}`,
    'Path=/', 'HttpOnly', 'SameSite=Lax', 'Secure', `Max-Age=${7 * 24 * 60 * 60}`
  ].join('; '));
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0');
}

function login(username, password) {
  if (username !== ADMIN_USER || !bcrypt.compareSync(password || '', passwordHash)) return null;
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { getUser, setSessionCookie, clearSessionCookie, login };
