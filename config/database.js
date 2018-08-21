const { password } = require('../app/acesso');

module.exports = {
  username: 'root',
  password,
  database: 'documentation',
  host: '127.0.0.1',
  dialect: 'mysql',
};
