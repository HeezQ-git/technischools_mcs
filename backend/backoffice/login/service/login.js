const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../../../config/database.connection.js');
require('dotenv').config();

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const login = async (req, res) => {
  const response = {
    success: false,
  };
  const account = await prisma.accounts.findFirst({
    where: {
      username: req.body.username,
    },
  });

  let result;
  if (account)
    result = await bcrypt.compare(req.body.password, account.password);
  if (result) {
    const token = jwt.sign({ name: req.body.username, clientId: account.client_id, accountId: account.id }, process.env.PASS);
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


