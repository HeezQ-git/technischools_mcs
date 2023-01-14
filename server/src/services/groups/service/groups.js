const db = require('../../../../db/db.connection.js');
require('dotenv').config();

const getAllGroups = async (req, res) => {
  const response = {
    success: false,
  };

  const { groups } = await db.clients.findUnique({
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

  response.success = true;
  response.groups = groups;
  return res.status(200).json(response);
};

const getGroupById = async (req, res) => {
  const response = {
    success: false,
  };
  const { groups } = await db.clients.findUnique({
    where: {
      id: req.decoded.clientId,
    },
    select: {
      groups: {
        where: {
          id: parseInt(req.body.id),
          active: true
        },
        include: {
          users: {
            where: {
              active: true,
            }
          }
        }
      }
    }
  });

  if (groups.length) response.success = true;

  response.group = groups[0];

  return res.status(200).json(response);
};

const checkIfGroupExists = async (name, clientId) => {
  const { groups } = await db.clients.findUnique({
    where: {
      id: clientId,
    },
    select: {
      groups: {
        where: {
          name: name,
          active: true
        }
      }
    }

  });
  return !!groups.length;
};

const createGroup = async (req, res) => {
  const response = {
    success: false,
    error: {
      message: '',
    }
  };

  const data = req.body;
  const clientId = req.decoded.clientId;
  const exists = await checkIfGroupExists(data.name, clientId);

  if (exists) {
    response.error.message = 'Grupa pod taką nazwą już istnieje';
  } else {
    const group = await db.groups.create({
      data: {
        name: data.name,
        clients: {
          connect: {
            id: clientId,
          }
        },
        users: {
          connect: data.userIds.map((userId) => ({ id: userId })),
        }
      },
    });
    if (group) response.success = true;
  }
  return res.status(200).json(response);
};

const editGroup = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };

  const data = req.body;
  const exists = await checkIfGroupExists(data.name, req.decoded.clientId);
  if (exists) {
    response.error = true;
  } else {
    const update = await db.groups.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      }
    });

    if (update) response.success = true;

  };
  return res.status(200).json(response);
};

const deleteGroup = async (req, res) => {
  const response = {
    success: false,
  };

  const update = await db.groups.update({
    where: {
      id: req.body.id,
    },
    data: {
      active: false,
    },
  });

  if (update) response.success = true;
  return res.status(200).json(response);
};

const addToGroup = async (req, res) => {
  const response = {
    success: false,
  };
  const update = await db.groups.update({
    where: {
      id: req.body.groupId,
    },
    data: {
      users: {
        connect: { id: req.body.userId }
      }
    }
  });

  if (update) response.success = true;

  return res.status(200).json(response);
};

const removeFromGroup = async (req, res) => {
  const response = {
    success: false,
  };

  const update = await db.groups.update({
    where: {
      id: req.body.groupId,
    },
    data: {
      users: {
        disconnect: { id: req.body.userId }
      }
    }
  });

  if (update) response.success = true;

  return res.status(200).json(response);
};

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  editGroup,
  deleteGroup,
  addToGroup,
  removeFromGroup,
};
