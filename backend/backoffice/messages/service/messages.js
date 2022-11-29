const db = require('../../../config/database.connection.js');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const { SMSAPI } = require('smsapi');
const smsapi = new SMSAPI(process.env.SMSAPI_TOKEN);

const getAllMessages = async (req, res) => {
    const response = {
        success: false,
    };

    const [allMessages] = await db.query(`SELECT messages.id, type, title, content, date, account_id FROM messages
                                        JOIN accounts ON messages.account_id = accounts.id
                                        WHERE accounts.client_id = ?`, [req.decoded.clientId]);

    if (!!allMessages.length) response.success = true;

    response.messages = allMessages;

    return res.status(200).json(response);
}

const sendMessage = async (req, res) => {
    const response = {
        success: false,
    };
    const type = req.body.type;
    const [message] = await db.query(`INSERT INTO messages (title, content, type, account_id, date) VALUES (?, ?, ?, ?, ?)`, [
        req.body.title,
        req.body.content,
        type,
        req.decoded.accountId,
        new Date()
    ]);

    let sentMessages = []
    let receiverNumbers = ''
    for await (const receiver of req.body.receivers) {
        const [userReceivers] = await db.query(`SELECT * FROM groups_users
            JOIN users ON users.id = groups_users.user_id
            WHERE group_id = ? and users.client_id = ?`, [receiver.id, req.decoded.clientId]);
        for await (const userReceiver of userReceivers) {
            if (type === 'email') {
                const msg = {
                    to: userReceiver.email,
                    from: 'dkupyn@gmail.com', // Change to your verified sender
                    subject: req.body.title,
                    text: req.body.content,
                    html: req.body.content,
                }
                if (!sentMessages.includes(userReceiver.email)) {
                    const res = await sgMail.send(msg);
                    if (res) response.success = true;
                    sentMessages.push(userReceiver.email);
                }
            }
            else if (type === 'sms') {
                if (!receiverNumbers.includes(userReceiver.phone_number)) {
                    receiverNumbers += `+48${userReceiver.phone_number},`;
                }
            }
        }
        if (type === 'sms') {
            try {
                const res = await smsapi.sms.sendSms(
                    receiverNumbers,
                    req.body.content,
                );
                if (res) response.success = true;

            } catch (e) {
                console.log(e);
            }
        }
        if (response.success) {
            await db.query(`INSERT INTO messages_groups ( message_id, group_id ) VALUES (?, ?)`, [
                message.insertId,
                receiver.id
            ])
        }
    }

    return res.status(200).json(response);

}

const getMessagesGroups = async (req, res) => {
    const [messagesGroups] = await db.query(`SELECT * FROM messages_groups
                                        JOIN ${process.env.DB_NAME}.groups ON ${process.env.DB_NAME}.groups.id = messages_groups.group_id
                                        WHERE messages_groups.message_id = ?`, [req.body.id]);
    return res.status(200).json(messagesGroups);
}

module.exports = {
    getAllMessages,
    sendMessage,
    getMessagesGroups
};
