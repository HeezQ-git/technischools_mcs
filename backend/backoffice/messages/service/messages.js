const Messages = require("../../../models/messages");
const Groups = require("../../../models/groups");
const Users = require("../../../models/persons");

const accountSid = "AC87b375e1ee91c45d08941ba719bdf227";
const authToken = "287c19108acbdd2836784518d894ad49";

const twilio = require("twilio");
const client = new twilio(accountSid, authToken);

const sendMessage = async (req, res) => {
  const numbers = [];
  let _group = await Groups.findOne({ _id: req.body.groups[0].id });

  for await (const userid of _group.userid) {
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
    receiver: _group.id,
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
