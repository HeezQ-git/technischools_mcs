const db = require('../../../../db/db.connection.js');
require('dotenv').config();

const { send } = require('./send');

const getAllMessages = async (req, res) => {
    const response = {
        success: false,
    };

    const client = await db.clients.findUnique({
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

    const account = await db.accounts.findUnique({
        where: {
            id: req.decoded.accountId,
        }
    });

    let receivers = new Set();
    for await (const receiver of data.receivers) {
        for await (const user of receiver.users) {
            switch (type) {
                case 'email':
                    receivers.add(user.email);
                    break;
                case 'sms':
                    receivers.add(user.phone_number);
                    break;
                default:
                    break;
            }
        }
    }

    const { success } = await send(data, type, account.email, receivers);

    if (!success) return res.status(200).json(response);
    else response.success = true;

    const message = await db.messages.create({
        data: {
            title: data.title,
            content: data.content,
            type: type,
            account_id: req.decoded.accountId,
            date: new Date()
        }
    });

    for await (const receiver of data.receivers) {
        if (response.success) {
            await db.messages.update({
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

    if (!response.success) {
        await db.messages.delete({
            where: {
                id: message.id
            }
        });
    }

    return res.status(200).json(response);
}


module.exports = {
    getAllMessages,
    sendMessage,
};
