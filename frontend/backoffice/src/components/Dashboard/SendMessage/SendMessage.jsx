import React, { useEffect, useState } from 'react';
import './SendMessage.scss';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { MailerService } from '../../../services/mailer.service';
import { MessagesService } from '../../../services/messages.service';

import Input from '../../Input/Input';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import { LoadingButton } from '@mui/lab';
import { CgSearch } from 'react-icons/cg';

const SendMessage = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [type, setType] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [messageType, setMessageType] = useState('email');

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
  const getGroups = async () => {
    setLoading(true);

    const res = await GroupsService.getAllGroups();
    if (res.data.success) {
      setGroups(res.data.groups);
      const _types = [];

      res.data.groups.map((group) => {
        _types.push({ label: group.name, id: group._id });
      });

      setTypes(_types);
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

  const sendMessage = async () => {
    if (!title) return setError('TITLE');
    else if (!content) return setError('CONTENT');
    else if (!type.length) return setError('GROUPS');

    setError('');
    setLoading(true);

    const res = await MailerService.sendEmail({
      title,
      content,
      groups: type,
      type: messageType,
    });

    getMessages();
    setLoading(false);
    // console.log(res);
  };

  const searchMessages = () => {};
  useEffect(() => {
    getGroups();
    getUsers();
    getMessages();
  }, []);

  return (
    <div className='messages'>
      <div className='messages_send'>
        <div className='messages_send_title'>
          <Input
            placeholder='Tytuł'
            label='Tytuł'
            size='small'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            error={error == 'TITLE'}
            fullWidth
            required
          />
        </div>
        <div className='messages_send_textarea'>
          <Input
            placeholder='Treść'
            label='Treść'
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError('');
            }}
            error={error == 'CONTENT'}
            multiline
            minRows={5}
            maxRows={5}
            fullWidth
            required
          />
        </div>
        <div className='messages_send_select'>
          <Autocomplete
            disablePortal
            multiple
            options={types}
            value={type}
            onChange={(event, newValue) => {
              setType(newValue);
              setError('');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={error == 'GROUPS'}
                label='Nazwa Grupy'
                required
              />
            )}
          />
        </div>
        <div className='messages_send_submit'>
          <RadioGroup
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className='messages_send_submit_radio'
          >
            <FormControlLabel
              value='email'
              control={<Radio />}
              label='E-mail'
            />
            <FormControlLabel value='sms' control={<Radio />} label='SMS' />
          </RadioGroup>
          <LoadingButton
            variant={document.body.clientWidth <= 480 ? 'text' : 'contained'}
            loading={loading}
            loadingPosition='start'
            startIcon={<IoMdSend />}
            onClick={() => sendMessage()}
            className='messages_send_submit_button'
          >
            Wyślij
          </LoadingButton>
        </div>
      </div>
      <div className='messages_history'>
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
              <div className='message-item-container'>
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
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
