import React, { useEffect, useState } from 'react';
import '../SendMessage.scss';
import { GroupsService } from '../../../../services/groups.service';
import { UsersService } from '../../../../services/users.service';
import { MailerService } from '../../../../services/mailer.service';
import { MessagesService } from '../../../../services/messages.service';

import Input from '../../../Input/Input';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { Button } from '@mui/material';

import { IoMdSend } from 'react-icons/io';
import { LoadingButton } from '@mui/lab';
import { CgSearch } from 'react-icons/cg';

const AllMessages = ({ refresh }) => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(null);
  const [openedMessage, setOpenedMessage] = useState(null);
  const getUserById = (userId) =>
    users.filter((user) => user._id === userId)[0];

  const getUsers = async () => {
    setLoading(true);

    setUsers([]);
    const res = await UsersService.getAllUsers();
    const users = res.data.users;

    if (res.data.success) {
      setUsers(users);
    }

    setLoading(false);
  };

  const getMessages = async () => {
    setLoading(true);

    setMessages([]);
    const res = await MessagesService.getAllMessages();
    console.log(res);
    const messages = res.data.messages;

    if (res.data.success) {
      setMessages(messages);
    }

    setLoading(false);
  };

  const searchMessages = () => {};
  useEffect(() => {
    getUsers();
    getMessages();
  }, []);

  return (
    <div className='messages_history'>
      {!openedMessage ? (
        <>
          <div className='messages_history_search'>
            <h2 className='messages_history_search_title'>
              Wszystkie wiadomości
            </h2>
            <Input
              className='messages_history_search_input'
              size='small'
              starticon={<CgSearch />}
              placeholder='Szukaj...'
              onChange={(e) => searchMessages(e.target.value)}
            />
          </div>
          <div className='messages_history_list'>
            {messages.map((message, index) => {
              return (
                <div
                  className='message-item-container'
                  onClick={() => setOpenedMessage(message)}
                  key={index}
                >
                  <div className='message-item'>
                    <div className='message-item_main hover:drop-shadow-md'>
                      <div className='message-item_main_title'>
                        {message.title}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>{' '}
        </>
      ) : (
        <div className='message_history_message'>
          <Button onClick={() => setOpenedMessage(null)}>Wróć</Button>
        </div>
      )}
    </div>
  );
};

export default AllMessages;
