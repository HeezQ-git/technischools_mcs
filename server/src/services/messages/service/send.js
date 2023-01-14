const { SMSAPI } = require('smsapi');
const sgMail = require('@sendgrid/mail');

const smsapi = new SMSAPI(process.env.SMSAPI_TOKEN);
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const send = async (data, type, sender, receivers) => {
  let success = false;
  switch (type) {
    case 'email':
      const msg = {
        to: Array.from(receivers),
        from: sender,
        subject: data.title,
        text: data.content,
        html: data.content,
      };
      try {
        await sgMail.send(msg);
        success = true;
      } catch (error) {
        console.error(error.response.body);
      }
      break;
    case 'sms':
      let phoneNumbers = Array.from(receivers).map((receiver) => `+48${receiver}`).join(',');
      try {
        await smsapi.sms.sendSms(phoneNumbers, data.content);
        success = true;
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      break;
  }

  return { success };
}

module.exports = {
  send
};
