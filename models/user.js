const db = require('../util/database');

module.exports = class User {
  constructor(name, pnumber, email, country, connection, password) {
    this.name = name;
    this.pnumber = pnumber;
    this.email = email;
    this.country = country;
    this.connection = connection;
    this.password = password;
  }

  static find(email) {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  }

  static save(user) {
    return db.execute(
      'INSERT INTO users (name, pnumber, email, country, connetion, password) VALUES (?, ?, ?, ?, ?, ?)',
      [user.name, user.pnumber, user.email, user.country, user.connection, user.password]
    );
  }
};