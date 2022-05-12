const Messages = require("../../../models/messages");
const Groups = require("../../../models/groups");
const Users = require("../../../models/persons");

const accountSid = "AC87b375e1ee91c45d08941ba719bdf227";
const authToken = "287c19108acbdd2836784518d894ad49";

const twilio = require("twilio");
const client = new twilio(accountSid, authToken);

const sendMessage = async (req, res) => {
  let numbers = [];
  let allGroups = [];
  let users = [];

  for (const group of req.body.groups) {
    allGroups.push(group.id);
  }

  for (const group of allGroups) {
    let _group = await Groups.findOne({ _id: group });
    _group.userid.map((_) => users.push(_));
  }

  users = [...new Set(users)];

  for await (const userid of users) {
    let user = await Users.findOne({ _id: userid });
    numbers.push(user.telephone);
  }

  Promise.all(
    numbers.map((number) => {
      return client.messages.create({
        to: "+48" + number,
        from: "+16822675681",
        body: req.body.title + "\r\n\r\n" + req.body.content,
      });
    })
  );

  await Messages.create({
    type: req.body.type,
    title: req.body.title,
    content: req.body.content,
    receiver: req.body.groups.map((_) => _.id),
    sender: "Admin",
  });

  return res.status(200).json("dziala");
};

const getAllMessages = async (req, res) => {
  const response = {
    success: false,
  };

  const messages = await Messages.find();
  if (messages) {
    response.messages = messages;
    response.success = true;
  }

  return res.status(200).json(response);
};

module.exports = {
  sendMessage,
  getAllMessages,
};
