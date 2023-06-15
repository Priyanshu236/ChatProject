const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const jwtSecret  = process.env.SECRET;
console.log(jwtSecret)
module.exports = async function(req, res) {
  let { username, password } = req.body
  const user = await User.findOne({ username });
  if (user && username && password) {
    const passOk = bcrypt.compareSync(password, user.password)
    if (passOk) {
      jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).status(201).json({
          id: user._id,
        })
      })
    }
  }
  else {
    res.status(400).send("invalid credentials")
  }
}
