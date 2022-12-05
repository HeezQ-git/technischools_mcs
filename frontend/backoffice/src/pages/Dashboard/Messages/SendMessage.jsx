/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState, useReducer } from 'react';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { MessagesService } from '../../../services/messages.service';
import { SendMessageStyles } from './messages.styles';
import Input from '../../../components/Input/Input';
import MessageHistory from './MessageHistory';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import { LoadingButton } from '@mui/lab';
import { ThemeContext } from '../../../App';
import { reducer, initialMessagesState } from '../../../utils/reducer';

const SendMessage = () => {
  const [state, dispatch] = useReducer(reducer, initialMessagesState);
  const [loading, setLoading] = useState(null);
  const [refreshMessages, setRefreshMessages] = useState(true);

  const {theme} = useContext(ThemeContext);


  const getUsers = async () => {
    setLoading(true);

    dispatch({type: 'set', field: 'users', value: []});
    const res = await UsersService.getAllUsers();

    if (res.data.success) {
      dispatch({type: 'set', field: 'users', value: res.data.users});
    }
    setLoading(false);
  };

  const getGroups = async () => {
    setLoading(true);
    const res = await GroupsService.getAllGroups();
    if (res.data.success) {
      res.data.groups.forEach((group) => {
        dispatch({type: 'add', field: 'groups', value: { label: group.name, id: group.id, users: group.users }});
      });
    }
    setLoading(false);
    console.log(state.groups);
  };

  const sendMessage = async () => {
    if (!state.title) dispatch({type: 'add', field: 'errors', value: 'TITLE' });
    else if (!state.content) dispatch({type: 'add', field: 'errors', value: 'CONTENT' });
    else if (!state.receiverGroups.length) dispatch({type: 'add', field: 'errors', value: 'RECEIVERS' });
    else if (state.errors.length) return;
    else {
      const res = await MessagesService.sendMessage({
        title: state.title,
        content: state.content,
        receivers: state.receiverGroups,
        type: state.type,
      });
      if (res.data.success) {
        setRefreshMessages(true);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getGroups();
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={SendMessageStyles.messages}>
      <div css={SendMessageStyles.sendMessage(theme)}>
        <div css={SendMessageStyles.fullWidth}>
          <Input
            placeholder='Tytuł'
            label='Tytuł'
            size='small'
            value={state.title}
            onChange={(e) => {
              dispatch({type: 'set', field: 'title', value: e.target.value});
              dispatch({type: 'remove', field: 'errors', value: 'TITLE' });
            }}
            error={state.errors.includes('TITLE')}
            fullWidth
            required
          />
        </div>
        <div css={SendMessageStyles.fullWidth}>
          <Input
            placeholder='Treść'
            label='Treść'
            value={state.content}
            onChange={(e) => {
              dispatch({type: 'set', field: 'content', value: e.target.value});
              dispatch({type: 'remove', field: 'errors', value: 'CONTENT' });
            }}
            error={state.errors.includes('CONTENT')}
            multiline
            minRows={5}
            maxRows={5}
            fullWidth
            required
          />
        </div>
          <Autocomplete
            disablePortal
            multiple
            options={state.groups}
            value={state.receiverGroups}
            onChange={(event, newValue) => {
              dispatch({type: 'set', field: 'receiverGroups', value: newValue});
              dispatch({type: 'remove', field: 'errors', value: 'RECEIVERS'});
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={state.errors.includes('RECEIVERS')}
                label='Nazwa Grupy'
                required
              />
            )}
          />
        <div css={SendMessageStyles.submit}>
          <RadioGroup
            value={state.type}
            onChange={(e) => dispatch({type: 'set', field: 'type', value: e.target.value})}
            css={SendMessageStyles.radioGroup}
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
            css={SendMessageStyles.button}
          >
            Wyślij
          </LoadingButton>
        </div>
      </div>
      <MessageHistory
        refresh={refreshMessages}
        setRefreshMessages={setRefreshMessages}
      />
    </div>
  );
};

export default SendMessage;
