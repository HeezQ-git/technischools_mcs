const prisma = require('../../../config/database.connection.js');

const getAllUsers = async (req, res) => {
  const response = {
    success: false,
  };
  const { users } = await prisma.clients.findUnique({
    where: {
      id: req.decoded.clientId,
    },
    select: {
      users: {
        where: {
          active: true
        }
      }
    }
  });


  if (users.length) {
    response.success = true;
    response.users = users;
  }
  return res.status(200).json(response);
};

const getUsersPerPage = async (req, res) => {
  ``
  const response = {
    success: false,
  };
  const { users } = await prisma.clients.findUnique({
    where: {
      id: req.decoded.clientId,
    },
    select: {
      users: {
        where: {
          active: true
        },
        skip: req.body.skip,
        take: req.body.take
      }
    }
  });

  if (users.length) response.success = true;

  response.users = users;
  return res.status(200).json(response);

};

const getUser = async (req, res) => {
  const response = {
    success: false,
  };

  const { users } = await prisma.clients.findUnique({
    where: {
      id: req.decoded.clientId,
    },
    select: {
      users: {
        where: {
          id: parseInt(req.body.id),
          active: true
        }
      }
    }
  })
  if (users[0]) {
    response.success = true;
    response.user = users[0];
  }

  return res.status(200).json(response);
};

const addUser = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };
  const data = req.body;
  const clientId = req.decoded.clientId;
  const { users } = await prisma.clients.findUnique({
    where: {
      id: clientId,
    },
    select: {
      users: {
        where: {
          email: data.email,
          active: true
        }
      }
    }
  });

  if (!users[0]) {
    const creation = await prisma.users.create({
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone_number: data.phone_number,
        active: true,
        clients: {
          connect: {
            id: clientId
          }
        }

      }
    })
    if (creation) {
      response.success = true;
    }
  }

  return res.status(200).json(response);
};

const editUser = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  const clientId = req.decoded.clientId;
  const data = req.body;
  const id = parseInt(data.id);
  const { users } = await prisma.clients.findUnique({
    where: {
      id: clientId,
    },
    select: {
      users: {
        where: {
          email: data.email,
          active: true
        }
      }
    }
  });
  if ((users[0] && users[0].id === id) || !users[0]) {
    const update = await prisma.users.update({
      where: {
        id: id
      },
      data: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone_number: data.phone_number,
      }
    });

    if (update) {
      response.success = true;
    }
  } else response.message = 'Użytkownik z takim adresem email już istnieje';

  return res.status(200).json(response);
};

const deleteUser = async (req, res) => {
  const response = {
    success: false,
  };
  const id = req.body.id;
  const { users } = await prisma.clients.findUnique({
    where: {
      id: req.decoded.clientId,
    },
    select: {
      users: {
        where: {
          id: id,
          active: true
        }
      }
    }
  })

  if (users[0]) {
    const deletion = await prisma.users.update({
      where: {
        id: id
      },
      data: {
        active: false
      }
    })
    if (deletion) {
      response.success = true;
    }
  }
  return res.status(200).json(response);
};

module.exports = {
  getAllUsers,
  getUsersPerPage,
  getUser,
  addUser,
  editUser,
  deleteUser,
};
