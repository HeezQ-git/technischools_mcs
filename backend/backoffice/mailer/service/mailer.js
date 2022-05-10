const nodemailer = require('nodemailer');
const Groups = require('../../../models/groups');
const jwt = require('jsonwebtoken');
const Users = require('../../../models/persons');
const Messages = require('../../../models/messages');
require('dotenv').config();

const pass = 'Technischools!';
let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: `${process.env.MAILER_USER}`,
    pass: `${process.env.MAILER_PASSWORD}`,
  },
});

const sendMail = async (userEmail, content, title) => {
  let info = await transporter.sendMail({
    from: `"Technischools" <${process.env.MAILER_USER}>`,
    to: userEmail,
    subject: title,
    text: content,
    html: `<p>${content}</p>`,
  });

  return info;
};

const sendEmail = async (req, res) => {
  const response = {
    success: false,
  };

  let groups = req.body.groups;
  if (!!groups && req.body.title && req.body.content) {
    const allGroups = [];

    for await (const _group of groups) {
      allGroups.push(await Groups.findOne({ _id: _group.id }));
    }

    let users = [];
    allGroups.map((_) => users.push(..._.userid));
    users = [...new Set(users)];

    for await (const user of users) {
      const _user = await Users.findOne({ _id: user });

      try {
        const info = await sendMail(
          _user.email,
          req.body.content,
          req.body.title
        );

        if (info?.rejected?.length > 0) response.error = true;
      } catch (error) {
        console.log(error);
      }
    }

    const token = jwt.verify(req.cookies['token'], pass);

    await Messages.create({
      type: req.body.type,
      title: req.body.title,
      content: req.body.content,
      receiver: req.body.groups.map((_) => _.id),
      sender: token.name,
    });
  }

  return res.status(200).json(response);
};

module.exports = {
  sendEmail,
};
