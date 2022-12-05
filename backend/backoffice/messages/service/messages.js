const prisma = require('../../../config/database.connection.js');
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const { SMSAPI } = require('smsapi');
const smsapi = new SMSAPI(process.env.SMSAPI_TOKEN);

const getAllMessages = async (req, res) => {
    const response = {
        success: false,
    };

    const client = await prisma.clients.findUnique({
        where: {
            id: req.decoded.clientId,
        },
        include: {
            accounts: {
                include: {
                    messages: {
                        include: {
                            receivers: true
                        }
                    }
                }
            },
        }
    });

    const messages = client.accounts.reduce((acc, account) => {
        account.messages.forEach(message => {
            acc.push({
                ...message,
                account: account.username
            })
        })
        return acc
    }, [])

    if (client) response.success = true;
    response.messages = messages;

    return res.status(200).json(response);
}

const sendMessage = async (req, res) => {
    const response = {
        success: false,
    };
    const data = req.body;
    const type = data.type;

    const message = await prisma.messages.create({
        data: {
            title: data.title,
            content: data.content,
            type: type,
            account_id: req.decoded.accountId,
            date: new Date()
        }
    });

    const account = await prisma.accounts.findUnique({
        where: {
            id: req.decoded.accountId,
        }
    });

    let sentMessages = []
    let receiverNumbers = ''
    console.log(account)
    for await (const receiver of data.receivers) {
        for await (const user of receiver.users) {
            if (type === 'email') {
                const msg = {
                    to: user.email,
                    from: account.email,
                    subject: data.title,
                    text: data.content,
                    html: data.content,
                }
                if (!sentMessages.includes(user.email)) {
                    const res = await sgMail.send(msg);
                    if (res) response.success = true;
                    sentMessages.push(user.email);
                }
            }
            else if (type === 'sms') {
                if (!receiverNumbers.includes(user.phone_number)) {
                    receiverNumbers += `+48${user.phone_number},`;
                }
            }
        }
        if (type === 'sms') {
            try {
                const res = await smsapi.sms.sendSms(
                    receiverNumbers,
                    data.content,
                );
                if (res) response.success = true;

            } catch (e) {
                console.log(e);
            }
        }
        if (response.success) {

            await prisma.messages.update({
                where: {
                    id: message.id
                },
                data: {
                    receivers: {
                        connect: { id: receiver.id }
                    }
                }
            });
        }
    }

    return res.status(200).json(response);
}

module.exports = {
    getAllMessages,
    sendMessage,
};
