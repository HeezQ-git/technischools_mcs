const prisma = require('../../../config/database.connection.js');
require('dotenv').config();

const getAllGroups = async (req, res) => {
  const response = {
    success: false,
  };

  const { groups } = await prisma.clients.findUnique({
    where: {
      id: req.decoded.clientId,
    },
    select: {
      groups: {
        where: {
          active: true,
        },
        include: {
          users: {
            where: {
              active: true,
            }
          }
        }
      },
    },
  });

  if (!!groups.length) response.success = true;
  response.groups = groups;

  return res.status(200).json(response);
};

const getGroupById = async (req, res) => {
  const response = {
    success: false,
  };
  const group = await prisma.groups.findUnique({
    where: {
      id: req.body.id,
    },
    include: {
      users: {
        where: {
          active: true,
        },
      },
    },
  });

  if (group) response.success = true;
  response.group = group;

  return res.status(200).json(response);
};

const getGroupsUsers = async (req, res) => {
  const [groupsUsers] = await db.query(`SELECT * FROM groups_users
                                        JOIN users ON users.id = groups_users.user_id
                                        WHERE group_id = ? and users.client_id = ?`, [req.body.id, req.decoded.clientId]);
  return res.status(200).json(groupsUsers);
}; //! to jest to samo, co wyzej, tylko bez prismy, trzeba usunac

const getAllGroupsUsers = async (req, res) => {
  const [groupsUsers] = await db.query(`SELECT * FROM groups_users
                                        JOIN users ON users.id = groups_users.user_id
                                        WHERE users.client_id = ?`, [req.decoded.clientId]);
  return res.status(200).json(groupsUsers);
}; //! to jest to samo, co wyzej, tylko bez prismy, trzeba usunac

const createGroup = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };
  const clientId = req.decoded.clientId;

  const { groups } = await prisma.clients.findUnique({
    where: {
      id: clientId,
    },
    select: {
      groups: {
        where: {
          name: req.body.name,
        },
      },
    },
  });
  const users = await prisma.users.findMany({
    where: {
      id: {
        in: req.body.userIds,
      },
    },
  });

  if (groups.length) {
    response.message = 'Grupa pod taką nazwą już istnieje';
  } else {
    const group = await prisma.groups.create({
      data: {
        name: req.body.name,
        clients: {
          connect: {
            id: clientId,
          }
        },
        users: {
          create: users.map(user => ({
            users: {
              connect: {
                id: user.id,
              },
            },
          }))
        }
      },
    });

    if (group) {
      response.success = true;
    }
  }

  return res.status(200).json(response);
};

const editGroup = async (req, res) => {
  const response = {
    success: false,
  };
  const [group] = await db.query(`UPDATE ${process.env.DB_NAME}.groups SET name = ? WHERE id = ?`, [req.body.name, req.body.id]);

  response.success = true;

  if (group[0]) response.success = true;

  return res.status(200).json(response);
};

const deleteGroup = async (req, res) => {
  const response = {
    success: false,
  };

  await db.query(`UPDATE ${process.env.DB_NAME}.groups SET active = 0 WHERE id = ?`, [req.body.id]);
  response.success = true;

  return res.status(200).json(response);
};

const addToGroup = async (req, res) => {
  const response = {
    success: false,
  };
  await db.query(`INSERT INTO groups_users (group_id, user_id) VALUES (?, ?)`, [
    req.body.groupId,
    req.body.userId
  ]);
  response.success = true;

  return res.status(200).json(response);
};

const removeFromGroup = async (req, res) => {
  const response = {
    success: false,
  };

  await db.query(`DELETE FROM groups_users WHERE group_id = ? AND user_id = ?`, [
    req.body.groupId,
    req.body.userId
  ]);
  response.success = true;

  return res.status(200).json(response);
};

module.exports = {
  getAllGroups,
  getGroupById,
  getGroupsUsers,
  getAllGroupsUsers,
  createGroup,
  editGroup,
  deleteGroup,
  addToGroup,
  removeFromGroup,
};
