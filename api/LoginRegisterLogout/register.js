const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const jwtSecret  = process.env.SECRET;
const salt = bcrypt.genSaltSync(10)
module.exports = async function(req, res) {
  let { username, password } = req.body
  if (!username || !password) {
    res.status(500).send("empty fields")
    return
  }
  password = bcrypt.hashSync(password, salt)
  let createdUser
  try {
    createdUser = await User.create({ username, password });
  } catch (err) {
    res.status(500).send("username exists")
    return
  }
  jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
    if (err) throw err;
    res.cookie('token', token).status(201).json({
      id: createdUser._id,
    })
  })
}
