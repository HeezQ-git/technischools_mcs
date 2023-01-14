import { Container, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { GroupsService } from '../../../services/groups.service';
import { useNavigate } from 'react-router-dom';
import { CreateGroupStyles } from './createGroup.styles';
import Input from '../../../components/Input/Input';
import { LoadingButton } from '@mui/lab';
import { TextField, Autocomplete } from '@mui/material';
import { UserPlus, ArrowLeft } from 'react-feather';
import { ThemeContext } from '../../../App';
import { useForm } from '../../../hooks/useForm';
import { css } from '@emotion/core';
import { useWindowSize } from '../../../hooks/useWindowSize';

const initialValues = {
  name: '',
  addedUsers: [],
};

const validationValues = {
  name: (value) => ({
    pattern: value.length > 0,
    message: 'Imię grupy jest wymagane',
  })
};

const CreateGroup = () => {
  const { values, handleChange, checkValidation, errors, clearErrors, addError } = useForm(initialValues);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { isMobile } = useWindowSize();

  const handleSubmit = async () => {
    const isValid = checkValidation(validationValues);
    if (!isValid) return;

    setLoading(true);

    let userIds = [];
    values.addedUsers.forEach((user) => {
      userIds.push(user.id);
    });

    const res = await GroupsService.createGroup({
      name: values.name,
      userIds,
    });

    if (res.data.success) {
      clearErrors();
      navigate('/dashboard/groups');
    } else {
      addError('name', res.data.error.message);
    }

    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const res = await UsersService.getAllUsers();

    if (res.data.success) {
      let users = [];
      res.data.users.forEach((user) => {
        users.push({ label: `${user.name} ${user.surname}`, id: user.id });
      });
      setUsers(users);
    }
  }, []);

  return (
    <Container css={CreateGroupStyles.createGroup} maxWidth='sm'>
      <div css={CreateGroupStyles.container(theme)}>
        <div css={CreateGroupStyles.box}>
          <h1 css={CreateGroupStyles.title}>Utwórz grupę</h1>
          <div css={CreateGroupStyles.names}>
            <Input
              autoFocus
              placeholder='Nazwa grupy'
              label='Nazwa'
              name='name'
              value={values.name}
              error={!!errors.name}
              helperText={
               errors.name
              }
              onChange={(e) => handleChange(e)}
              required
              fullWidth
            />
          </div>
          <div css={CreateGroupStyles.select}>
            <Autocomplete
              disablePortal
              multiple
              options={users}
              value={values.addedUsers}
              onChange={(event, values) => handleChange({ target: { name: 'addedUsers', value: values }, persist: () => {} })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Dodaj użytkowników'
                />
              )}
              fullWidth
            />
          </div>
          <div css={CreateGroupStyles.buttons}>
            <Button 
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate('/dashboard/groups/')}
              css={css`padding-inline: 16px;`}
            >
              Wróć
            </Button>
            <LoadingButton
              variant='contained'
              loading={loading}
              loadingPosition='start'
              startIcon={<UserPlus size={18} />}
              onClick={() => handleSubmit()}
            >
              {isMobile ? 'Utwórz' : 'Utwórz grupę'}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateGroup;
