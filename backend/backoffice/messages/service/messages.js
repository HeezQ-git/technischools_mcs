const Messages = require('../../../models/messages');

// const accountSid = 'AC87b375e1ee91c45d08941ba719bdf227';
// const authToken = '287c19108acbdd2836784518d894ad49';

// const twilio = require('twilio');
// const client = new twilio(accountSid, authToken);
// numbers = ['+48577234900', '+48728793264'];

// const sendMessage = (req, res) => {
//   Promise.all(
//     numbers.map((number) => {
//       return client.messages.create({
//         to: number,
//         from: '+16822675681',
//         body: 'Witam Witam',
//       });
//     })
//   );

//   return res.status(200).json('dziala');
// };

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
  //sendMessage,
  getAllMessages,
};
