import { useContext, useEffect, useMemo, useState } from 'react';
import { MessagesHistoryStyles, SendMessageStyles } from './messages.styles';
import { MessagesService } from '../../../services/messages.service';
import Input from '../../../components/Input/Input';
import { Button, Tooltip } from '@mui/material';
import { Chip } from '@mui/material';
import { ChevronDown, Mail, MessageCircle, Inbox, ArrowLeft } from 'react-feather';
import { css } from '@emotion/core';
import moment from 'moment';
import { ThemeContext } from '../../../App';
import { formatDate } from '../../../utils/functions';
import { useNavigate } from 'react-router';

const MessageHistory = ({ refresh, setRefreshMessages }) => {
  const [messages, setMessages] = useState([]);
  const [openedMessage, setOpenedMessage] = useState(null);
  const [openedReceiver, isOpenedReceiver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(null);
  const currentDate = new Date();

  const {theme} = useContext(ThemeContext);
  const navigate = useNavigate();

  const getMessages = async () => {
    setLoading(true);

    setMessages([]);
    const res = await MessagesService.getAllMessages();
    if (res.data.success) {
      setMessages(res.data.messages);
    }

    setLoading(false);
  };

    const filteredMessages = useMemo(() => messages.filter((message) => {
      return (message.title.toLowerCase().includes(searchQuery.toLowerCase()) 
      || message.content.toLowerCase().includes(searchQuery.toLowerCase()) 
      || formatDate(message.date).includes(searchQuery.toLowerCase()))
      || message.type.toLowerCase().includes(searchQuery.toLowerCase());
    }), [searchQuery, messages]);

  useEffect(() => {
    getMessages();
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
            <h2 css={css`display: flex; align-items: center; gap: 8px;`}>
              <Inbox size={20} />
              Wszystkie wiadomości
            </h2>
            <Input
              size='small'
              search={"true"}
              placeholder='Szukaj...'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div css={MessagesHistoryStyles.list}>
            {!loading && !!messages.length ? (
              filteredMessages
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((message) => {
              return (
                <div
                  css={SendMessageStyles.fullWidth}
                  onClick={() => {
                    setOpenedMessage(message);
                  }}
                  key={message.id}
                >
                  <div css={MessagesHistoryStyles.messageItem}>
                    <div css={MessagesHistoryStyles.messageMain(theme)}>
                      <div css={MessagesHistoryStyles.messageTitle}>
                        {message.type === 'sms' ? <MessageCircle size={17} /> : <Mail size={17} />}
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
                {!loading ? 'Brak wysłanych wiadomości' : 'Ładowanie...'}
              </div>
            )}
              
          </div>
        </>
      ) : (
        <div css={MessagesHistoryStyles.openedMessage}>
          <div css={MessagesHistoryStyles.openedMessageHeader}>
            <Button 
              startIcon={<ArrowLeft size={18} />}
              onClick={() => setOpenedMessage(null)}
              css={css`padding-inline: 16px;`}
            >
              Wróć
            </Button>
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
                {openedMessage.receivers.map((group, index) => {
                  return <Tooltip title='Przenieś do grupy'><Chip key={index} label={group.name} onClick={() => navigate(`/dashboard/groups/${group.id}`)} /></Tooltip>;
                })}
              </div>
              {openedMessage.receivers.length > 2 && (
                <h2
                css={MessagesHistoryStyles.arrow(openedReceiver)}
                  onClick={() => isOpenedReceiver(!openedReceiver)}
                >
                  <ChevronDown size={20} className='icon' />
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
