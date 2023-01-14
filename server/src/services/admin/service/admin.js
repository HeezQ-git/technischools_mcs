const db = require('../../../../db/db.connection.js');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const getAllAccounts = async (req, res) => {
  const response = {
    success: false,
  };
  if (req.decoded.accountType === 'admin') {
    const { accounts } = await db.clients.findUnique({
      where: {
        id: req.decoded.clientId,
      },
      select: {
        accounts: true
      },
    },
    );
    response.success = true;
    response.accounts = accounts;
  }
  else if (req.decoded.accountType === 'root') {
    const accounts = await db.accounts.findMany({
      include: {
        clients: true
      }
    });

    response.success = true;
    response.accounts = accounts;
  }
  return res.status(200).json(response);
};

const getAllClients = async (req, res) => {
  const response = {
    success: false,
  };
  if (req.decoded.accountType === 'root') {
    const clients = await db.clients.findMany();
    response.success = true;
    response.clients = clients;
  }
  return res.status(200).json(response);
};

const createAccount = async (req, res) => {
  const response = {
    success: false,
  };
  const password = await hashPassword(req.body.password);
  const account = await db.accounts.create({
    data: {
      username: req.body.username,
      password: password,
      email: req.body.email,
      type: req.body.type,
      clients: {
        connect: {
          id: req.decoded.accountType === 'admin' ? req.decoded.clientId : req.body.client.id,
        }
      }
    }

  });
  response.success = true;
  response.account = account;

  return res.status(200).json(response);
};

const createClient = async (req, res) => {
  const response = {
    success: false,
  };
  if (req.decoded.accountType === 'root') {
    const client = await db.clients.create({
      data: {
        name: req.body.name,
      }
    });
    response.success = true;
    response.client = client;
  }
  return res.status(200).json(response);
};

module.exports = {
  getAllAccounts,
  getAllClients,
  createAccount,
  createClient
}