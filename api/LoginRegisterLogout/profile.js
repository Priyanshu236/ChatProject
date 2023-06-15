const jwt = require('jsonwebtoken');
const jwtSecret = process.env.SECRET
module.exports = async (req, res) => {
    console.log("PROFILE")
    const { token } = req.cookies
    if (token) {

        jwt.verify(token, jwtSecret, {}, (err, data) => {
            if (err) throw err;

            res.json(data)
        })
    }
    else {
        res.status(501).send("sign in")
    }
}