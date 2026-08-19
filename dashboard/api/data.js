const { getUser } = require('../lib/auth');
const { loadData, saveData } = require('../lib/mongodb');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      return res.status(200).json(await loadData());
    }

    if (req.method !== 'PUT') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!getUser(req)) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      return res.status(400).json({ error: 'Invalid data payload.' });
    }

    await saveData(incoming);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Dashboard data error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to save/load dashboard data.'
    });
  }
};
