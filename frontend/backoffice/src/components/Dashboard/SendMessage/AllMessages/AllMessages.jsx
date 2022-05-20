import React, { useEffect, useState } from 'react';
import '../SendMessage.scss';
import { GroupsService } from '../../../../services/groups.service';
import { UsersService } from '../../../../services/users.service';
import { MessagesService } from '../../../../services/messages.service';

import Input from '../../../Input/Input';
import { Button } from '@mui/material';
import { Chip } from '@mui/material';
import { CgSearch } from 'react-icons/cg';
import { MdExpandMore } from 'react-icons/md';

import moment from 'moment';

const AllMessages = ({ refresh, setRefreshMessages }) => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(null);
  const [openedMessage, setOpenedMessage] = useState(null);
  const [openedReceiver, isOpenedReceiver] = useState(false);
  const [date, setDate] = useState(null);
  const currentDate = new Date();
  const getUserById = (userId) =>
    users.filter((user) => user._id === userId)[0];

  const getGroupById = (groupId) =>
    groups.filter((group) => group._id === groupId)[0];

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
    getGroups();
    getUsers();
    getMessages();
  }, []);

  useEffect(() => {
    console.log('refresh');
    getMessages();
    setRefreshMessages(false);
  }, [refresh]);

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
                  onClick={() => {
                    setDate(new Date(message.date));
                    setOpenedMessage(message);
                  }}
                  key={index}
                >
                  <div className='message-item'>
                    <div className='message-item_main hover:drop-shadow-md'>
                      <div className='message-item_main_title'>
                        {message.title}
                      </div>
                      <div className='message-item_main_time'>
                        {currentDate.toISOString().split('T')[0] ==
                        message.date.split('T')[0]
                          ? 'Dziś o ' + moment(message.date).format('HH:mm')
                          : moment(message.date).format('l')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className='messages_history_opened-message'>
          <div className='messages_history_opened-message_header'>
            <Button onClick={() => setOpenedMessage(null)}>Wróć</Button>
            <h2 className='messages_history_opened-message_header_title'>
              {openedMessage.title}
            </h2>
          </div>
          <div className='messages_history_opened-message_content'>
            {openedMessage.content}
          </div>
          <div className='messages_history_opened-message_info'>
            <div
              className={`messages_history_opened-message_info_receivers ${
                openedReceiver ? 'opened' : ''
              }`}
              onClick={() => {
                if (openedMessage.receiver.length <= 2) return;
                isOpenedReceiver(!openedReceiver);
              }}
            >
              {openedMessage.receiver.map((id, index) => {
                return <Chip key={index} label={getGroupById(id).name} />;
              })}
            </div>
            {openedMessage.receiver.length > 2 && (
              <h2
                className={`messages_history_opened-message_info_arrow ${
                  openedReceiver ? 'flipped' : ''
                }`}
                onClick={() => isOpenedReceiver(!openedReceiver)}
              >
                <MdExpandMore size={26} className='icon' />
              </h2>
            )}
            <div className='messages_history_opened-message_info_time'>
              {/* {currentDate.toISOString().split('T')[0] ==
              date.toISOString().split('T')[0]
                ? moment(date).format('HH:mm')
                : moment(date).format('MMM Do YYYY')} */}
              {moment(date).format('l HH:mm')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMessages;
