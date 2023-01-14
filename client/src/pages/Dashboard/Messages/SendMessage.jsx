import { useContext, useEffect, useState } from 'react';
import { GroupsService } from '../../../services/groups.service';
import { MessagesService } from '../../../services/messages.service';
import { SendMessageStyles } from './messages.styles';
import Input from '../../../components/Input/Input';
import MessageHistory from './MessageHistory';
import { TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { RadioGroup } from '@mui/material';
import { Radio } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ThemeContext } from '../../../App';
import { useForm } from '../../../hooks/useForm';
import { Send } from 'react-feather';

const initialValues = {
    receiverGroups: [],
    title: '',
    content: '',
    type: 'email',
}

const validationValues = {
    receiverGroups: (value) => ({
      pattern: value.length > 0,
      message: 'Proszę wybrać chociąż jedną grupę odebrników',
    }),
    title: (value) => ({
      pattern: value.length > 0,
      message: 'Proszę wpisać tytuł wiadomości',
    }),
    content: (value) => ({
      pattern: value.length > 0,
      message: 'Proszę wpisać treść wiadomości',
    })
}


const SendMessage = () => {
  const { values, handleChange, checkValidation, errors} = useForm(initialValues);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(null);
  const [refreshMessages, setRefreshMessages] = useState(true);

  const {theme} = useContext(ThemeContext);

  const getGroups = async () => {
    setLoading(true);
    const res = await GroupsService.getAllGroups();
    
    if (res.data.success) {
      res.data.groups.forEach((group) => {
        setGroups((prev) => [...prev, { label: group.name, id: group.id, users: group.users }]);
      });
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    const isValid = checkValidation(validationValues);
    if (!isValid) return;
    setLoading(true);

    const res = await MessagesService.sendMessage({
      title: values.title,
      content: values.content,
      receivers: values.receiverGroups,
      type: values.type,
    });

    if (res.data.success) {
      setRefreshMessages(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getGroups();
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
            name='title'
            value={values.title}
            onChange={(e) => handleChange(e)}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />
        </div>
        <div css={SendMessageStyles.fullWidth}>
          <Input
            placeholder='Treść'
            label='Treść'
            name='content'
            value={values.content}
            onChange={(e) => handleChange(e)}
            error={!!errors.content}
            helperText={errors.content}
            multiline
            minRows={5}
            maxRows={5}
            fullWidth
            required
          />
        </div>
          <Autocomplete
            size='small'
            disablePortal
            multiple
            options={groups}
            value={values.receiverGroups}
            onChange={(event, values) => handleChange({target: {name: 'receiverGroups', value: values}, persist: () => {}})}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.receiverGroups}
                helperText={errors.receiverGroups}
                label='Nazwa Grupy'
                required
              />
            )}
          />
        <div css={SendMessageStyles.submit}>
          <RadioGroup
            value={values.type}
            name='type'
            onChange={(e) => handleChange(e)}
            css={SendMessageStyles.radioGroup}
            defaultValue='email'
          >
            <FormControlLabel value='email' control={<Radio />} label='E-mail' />
            <FormControlLabel value='sms' control={<Radio />} label='SMS' />
          </RadioGroup>
          <LoadingButton
            variant={document.body.clientWidth <= 480 ? 'text' : 'contained'}
            loading={loading}
            loadingPosition='start'
            startIcon={<Send size={18} />}
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
