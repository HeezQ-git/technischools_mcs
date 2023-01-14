const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkToken = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.PASS, (err, decoded) => {
        if (err) {
            return res.status(200).json({ success: false });
        } else {
            req.decoded = decoded;
            next();
        }
    });
}


module.exports = checkToken;