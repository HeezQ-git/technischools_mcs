const nodemailer = require('nodemailer');
const Groups = require('../../../models/groups');
const Users = require('../../../models/persons');
const Messages = require('../../../models/messages');
require('dotenv').config();

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

  const groups = req.body.groups;
  if (!!groups && req.body.title && req.body.content) {
    for await (const group of groups) {
      if (!group.id) return;

      const _group = await Groups.findOne({ _id: group.id });
      // console.log(req.body.groups);

      for await (const user of _group.userid) {
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

      await Messages.create({
        type: req.body.type,
        title: req.body.title,
        content: req.body.content,
        receiver: _group.id,
        sender: 'test123',
      });
    }
  }

  return res.status(200).json(response);
};

module.exports = {
  sendEmail,
};
