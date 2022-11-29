const db = require('../../../config/database.connection.js');

const getUser = async (req, res) => {
  const response = {
    success: false,
  };
  const [rows] = await db.query(`SELECT * FROM users WHERE id = ? AND active = 1 and client_id = ?`, [req.body.id, req.decoded.clientId]);

  if (rows.length) {
    response.success = true;
    response.user = rows[0];
  }

  return res.status(200).json(response);
};

const getAllUsers = async (req, res) => {
  const response = {
    success: false,
  };
  const [users] = await db.query(`SELECT * FROM users WHERE active = 1 AND client_id = ?`, [req.decoded.clientId]);
  if (users.length) {
    response.success = true;
    response.users = users;
  }
  return res.status(200).json(response);
};

const addUser = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  let checkUser = [];
  const clientId = req.decoded.clientId;

  if (req.body.email) [checkUser] = await db.query(`SELECT * FROM users WHERE email = ? and client_id = ?`, [req.body.email, clientId]);

  if (checkUser.length === 0) {
    await db.query(`INSERT INTO users (name, surname, email, phone_number, active, client_id) VALUES (?, ?, ?, ?, 1, ?
      )`, [
      req.body.name,
      req.body.surname,
      req.body.email || '',
      req.body.number || '',
      clientId,
    ])
      .then(([rows]) => {
        response.success = true;
      })
      .catch(error => {
        throw error;
      });

  } else response.message = 'Użytkownik z takim adresem email już istnieje';

  return res.status(200).json(response);
};

const editUser = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  let user, userEmail;
  const clientId = req.decoded.clientId;

  if (req.body.id)
    [user] = await db.query(`SELECT * FROM users WHERE id = ? and client_id = ?`, [req.body.id, clientId]);


  if (user[0] && req.body.email && user[0].email != req.body.email)
    [userEmail] = await db.query(`SELECT * FROM users WHERE email = ? and client_id = ?`, [req.body.email, clientId]);

  if (!userEmail) {
    await db.query(`UPDATE users SET name = ?, surname = ?, email = ?, phone_number = ? WHERE id = ? and client_id = ?`, [
      req.body.name,
      req.body.surname,
      req.body.email || '',
      req.body.phone_number || '',
      req.body.id,
      clientId,
    ]);
    response.success = true;

  } else response.message = 'Użytkownik z takim adresem email już istnieje';

  return res.status(200).json(response);
};

const deleteUser = async (req, res) => {
  const response = {
    success: false,
  };
  const [user] = await db.query(`SELECT * FROM users WHERE id = ? and client_id = ?`, [req.body.id, req.decoded.clientId]);

  if (user[0]) {
    db.query(`UPDATE users SET active = 0 WHERE id = ? and client_id = ?`, [req.body.id, req.decoded.clientId]);
    response.success = true;
  }
  return res.status(200).json(response);
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
};
