const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../../../db/db.connection.js');
require('dotenv').config();

const login = async (req, res) => {
  const response = {
    success: false,
    errors: {
      username: {
        isError: false,
        name: 'username',
        message: 'Nazwa użytkownika nie istnieje'
      },
      password: {
        isError: false,
        name: 'password',
        message: 'Nie poprawne hasło'
      }
    }
  };
  const account = await db.accounts.findFirst({
    where: {
      username: req.body.username,
    },
  });

  let result;
  if (account)
    result = await bcrypt.compare(req.body.password, account.password);
  else response.errors.username.isError = true;

  if (result) {
    const token = jwt.sign({ name: req.body.username, clientId: account.client_id, accountId: account.id, accountType: account.type }, process.env.PASS);
    res.cookie('token', token, { maxAge: 15552000, httpOnly: true, sameSite: 'strict' });
    response.success = true;

  } else response.errors.password.isError = true;
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
      .json({ success: (!!req.cookies.token && !!jwt.verify(req.cookies.token, process.env.PASS)), user: jwt.verify(req.cookies.token, process.env.PASS) });
  } catch {
    return res.status(200).json({ success: false });
  }
};

module.exports = {
  login,
  logout,
  checkSession,
};


