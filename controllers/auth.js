const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return;

  const name = req.body.name;
  const pnumber = req.body.pnumber;
  const email = req.body.email;
  const country = req.body.country;
  const connection = req.body.connection;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const userDetails = {
      name: name,
      punmber:pnumber,
      email: email,
      country: country,
      connection: connection,
      password: hashedPassword,
    };

    const result = await User.save(userDetails);

    res.status(201).json({ message: 'User registered!' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  try {
    const user = await User.find(name);

    if (user[0].length !== 1) {
      const error = new Error('A user name could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const storedUser = user[0][0];

    const isEqual = await bcrypt.compare(password, storedUser.password);

    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
// dont do be sure once again...............
    const token = jwt.sign(
      {
        email: storedUser.email,
        userId: storedUser.id,
      },
      'secretfortoken',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: storedUser.id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};