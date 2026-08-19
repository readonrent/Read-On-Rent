const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Usage: npm run hash-password -- "yourPassword"');
  process.exit(1);
}

console.log(bcrypt.hashSync(password, 10));
