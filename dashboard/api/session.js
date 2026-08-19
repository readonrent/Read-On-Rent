const { getUser } = require('../lib/auth');
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const user = getUser(req);
  res.status(200).json(user ? { loggedIn: true, username: user.username } : { loggedIn: false });
};
