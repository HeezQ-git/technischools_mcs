const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../../config/database.connection.js');
require('dotenv').config();

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const login = async (req, res) => {
  const response = {
    success: false,
  };
  const [account] = await db.query(`SELECT * FROM accounts WHERE username = ?`, [req.body.username]);
  let result;

  if (account[0])
    result = await bcrypt.compare(req.body.password, account[0].password);
  if (result) {
    const token = jwt.sign({ name: req.body.username, clientId: account[0].client_id, accountId: account[0].id }, process.env.PASS);
    res.cookie('token', token, { maxAge: 15552000, httpOnly: true });
    response.success = true;
  }
  return res.status(200).json(response);

};

const logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true });
};

const checkSession = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: (!!req.cookies.token && !!jwt.verify(req.cookies.token, process.env.PASS)) });
  } catch {
    return res.status(200).json({ success: false });
  }
};

module.exports = {
  login,
  logout,
  checkSession,
};


