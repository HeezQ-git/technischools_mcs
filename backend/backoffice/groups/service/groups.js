const db = require('../../../config/database.connection.js');
require('dotenv').config();

const getAllGroups = async (req, res) => {
  const response = {
    success: false,
  };

  const [allGroups] = await db.query(`SELECT * FROM ${process.env.DB_NAME}.groups WHERE active = 1 and client_id = ?`, [req.decoded.clientId]);

  if (!!allGroups.length) response.success = true;

  response.groups = allGroups;

  return res.status(200).json(response);
};

const getGroupById = async (req, res) => {
  const response = {
    success: false,
  };

  const [group] = await db.query(`SELECT * FROM ${process.env.DB_NAME}.groups WHERE id = ? and client_id = ?`, [req.body.id, req.decoded.clientId]);

  if (!!group.length) response.success = true;
  response.group = group[0];

  return res.status(200).json(response);
};

const getGroupsUsers = async (req, res) => {
  const [groupsUsers] = await db.query(`SELECT * FROM groups_users
                                        JOIN users ON users.id = groups_users.user_id
                                        WHERE group_id = ? and users.client_id = ?`, [req.body.id, req.decoded.clientId]);
  return res.status(200).json(groupsUsers);
};

const getAllGroupsUsers = async (req, res) => {
  const [groupsUsers] = await db.query(`SELECT * FROM groups_users
                                        JOIN users ON users.id = groups_users.user_id
                                        WHERE users.client_id = ?`, [req.decoded.clientId]);
  return res.status(200).json(groupsUsers);
};

const createGroup = async (req, res) => {
  const response = {
    success: false,
    message: '',
  };
  const clientId = req.decoded.clientId;

  const [checkGroup] = await db.query(`SELECT * FROM ${process.env.DB_NAME}.groups WHERE name = ? and client_id = ?`, [req.body.name, clientId]);
  if (checkGroup.length === 0) {
    await db.query(`INSERT INTO ${process.env.DB_NAME}.groups (name, client_id, active) VALUES (?, ?, 1)`, [
      req.body.name,
      clientId,
    ]);
    req.body.userIds.forEach(async (userId) => {
      const [group] = await db.query(`SELECT id FROM ${process.env.DB_NAME}.groups WHERE name = ? and client_id = ?`, [req.body.name, clientId]);
      const groupId = group[0].id;
      await db.query(`INSERT INTO groups_users (group_id, user_id) VALUES (?, ?)`, [
        groupId,
        userId
      ]);
    });

    response.success = true;
  } else response.message = 'Grupa pod taką nazwą już istnieje';

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
