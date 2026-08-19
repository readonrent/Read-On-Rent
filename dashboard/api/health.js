const { pingDatabase, getDbName } = require('../lib/mongodb');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await pingDatabase();
    res.status(200).json({ ok: true, database: getDbName() });
  } catch (err) {
    console.error('MongoDB health check failed:', err);
    res.status(500).json({ ok: false, error: err?.message || 'MongoDB connection failed' });
  }
};
