/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from 'react';
import { MessagesHistoryStyles, SendMessageStyles } from './messages.styles';
import { MessagesService } from '../../../services/messages.service';
import { FaSms } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Input from '../../../components/Input/Input';
import { Button } from '@mui/material';
import { Chip } from '@mui/material';
import { CgSearch } from 'react-icons/cg';
import { MdExpandMore } from 'react-icons/md';
import { css } from '@emotion/core';
import moment from 'moment';
import { ThemeContext } from '../../../App';
import { formatDate } from '../../../utils/functions';

const MessageHistory = ({ refresh, setRefreshMessages }) => {
  const [messages, setMessages] = useState([]);
  const [receiverGroups, setReceiverGroups] = useState([]);
  const [openedMessage, setOpenedMessage] = useState(null);
  const [openedReceiver, isOpenedReceiver] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(null);
  const currentDate = new Date();

  const {theme} = useContext(ThemeContext);

  const getMessagesGroups = async (id) => {
    const res = await MessagesService.getMessagesGroups({id: id});
    setReceiverGroups(res.data);

  };

  const getMessages = async () => {
    setLoading(true);

    setMessages([]);
    const res = await MessagesService.getAllMessages();
    if (res.data.success) {
      setMessages(res.data.messages);
    }

    setLoading(false);
  };

  const searchMessages = (data) => {
    const filtered = messages.filter((message) => {
      return (message.title.toLowerCase().includes(data.toLowerCase()) 
      || message.content.toLowerCase().includes(data.toLowerCase()) 
      || formatDate(message.date).includes(data.toLowerCase()))
      || message.type.toLowerCase().includes(data.toLowerCase());
    });
    setFilteredMessages(filtered);
  };

  useEffect(() => {
    getMessages();
    setFilteredMessages([])
  }, []);

  useEffect(() => {
    getMessages();
    setRefreshMessages(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <div css={MessagesHistoryStyles.history(theme)}>
      {!openedMessage ? (
        <>
          <div css={MessagesHistoryStyles.search}>
            <h2>
              Wszystkie wiadomości
            </h2>
            <Input
              size='small'
              starticon={<CgSearch />}
              placeholder='Szukaj...'
              onChange={(e) => searchMessages(e.target.value)}
            />
          </div>
          <div css={MessagesHistoryStyles.list}>
            {!loading && !!messages.length ? (
              messages
              .filter((e) => !filteredMessages.length || filteredMessages.find((f) => f.id === e.id))
              .reverse()
              .map((message, index) => {
              return (
                <div
                  css={SendMessageStyles.fullWidth}
                  onClick={() => {
                    setOpenedMessage(message);
                    getMessagesGroups(message.id);
                  }}
                  key={index}
                >
                  <div css={MessagesHistoryStyles.messageItem}>
                    <div css={MessagesHistoryStyles.messageMain(theme)}>
                      <div css={MessagesHistoryStyles.messageTitle}>
                        {message.type === 'sms' ? <FaSms /> : <MdEmail />}
                        {message.title}
                      </div>
                      <div css={MessagesHistoryStyles.messageDate}>
                        {currentDate.toISOString().split('T')[0] ===
                        message.date.split('T')[0]
                          ? 'Dziś o ' + moment(message.date).format('HH:mm')
                          : moment(message.date).format('DD/MM/YYYY')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })) : (
              <div css={MessagesHistoryStyles.noMessages}>
                {!loading ? 'Brak wiadomości' : 'Ładowanie...'}
              </div>
            )}
              
          </div>
        </>
      ) : (
        <div css={MessagesHistoryStyles.openedMessage}>
          <div css={MessagesHistoryStyles.openedMessageHeader}>
            <Button onClick={() => setOpenedMessage(null)}>Wróć</Button>
            <h2 css={MessagesHistoryStyles.openedMessageTitle}>
              {openedMessage.title}
            </h2>
          </div>
          <div css={css`margin-bottom: 16px`}>
            {openedMessage.content}
          </div>
          <div css={MessagesHistoryStyles.openedMessageInfo}>
            <div css={css`display: flex; align-items: center; gap: 8px;`}>
              <div
                css={MessagesHistoryStyles.receivers(openedReceiver)}
                onClick={() => {
                  if (openedMessage.receiver.length <= 2) return;
                  isOpenedReceiver(!openedReceiver);
                }}
              >
                {receiverGroups.map((group, index) => {
                  return <Chip key={index} label={group.name} />;
                })}
              </div>
              {receiverGroups.length > 2 && (
                <h2
                css={MessagesHistoryStyles.arrow(openedReceiver)}
                  onClick={() => isOpenedReceiver(!openedReceiver)}
                >
                  <MdExpandMore size={26} className='icon' />
                </h2>
              )}
            </div>
            <div>
              {moment(openedMessage.date).format('l HH:mm')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageHistory;
