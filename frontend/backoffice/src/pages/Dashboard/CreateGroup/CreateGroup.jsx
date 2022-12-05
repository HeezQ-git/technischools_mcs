/** @jsxImportSource @emotion/react */
import { Container, Button } from '@mui/material';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { GroupsService } from '../../../services/groups.service';
import { useNavigate } from 'react-router-dom';
import { CreateGroupStyles } from './createGroup.styles';
import Input from '../../../components/Input/Input';
import { LoadingButton } from '@mui/lab';
import { TextField, Autocomplete } from '@mui/material';
import { MdGroupAdd } from 'react-icons/md';
import { ThemeContext } from '../../../App';
import { reducer, initialCreateGroupState } from '../../../utils/reducer';

const CreateGroup = () => {
  const [state, dispatch] = useReducer(reducer, initialCreateGroupState);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const createGroup = async () => {
    if (!state.name) return dispatch({ type: 'add', field: 'error', value: 'NAME' });

    dispatch({ type: 'set', field: 'error', value: [] });
    setLoading(true);

    let userIds = [];
    state.addedUsers.forEach((user) => {
      userIds.push(user.id);
    });

    const res = await GroupsService.createGroup({
      name: state.name,
      userIds,
    });
    dispatch({ type: 'set', field: 'responseError', value: res.data.message });
    if (res.data.success) navigate('/dashboard/groups');

    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const res = await UsersService.getAllUsers();

    if (res.data.success) {
      dispatch({ type: 'set', field: 'users', value: res.data.users });
      const _types = [];

      res.data.users.forEach((user) => {
        _types.push({ label: `${user.name} ${user.surname}`, id: user.id });
      });
      
      dispatch({ type: 'set', field: 'users', value: _types });
    }
  }, []);

  return (
    <Container css={CreateGroupStyles.createGroup} maxWidth='sm'>
      <div css={CreateGroupStyles.container(theme)}>
        <div css={CreateGroupStyles.box}>
          <h1 css={CreateGroupStyles.title}>Stwórz grupę</h1>
          <div css={CreateGroupStyles.names}>
            <Input
              autoFocus
              placeholder='Nazwa grupy'
              label='Nazwa'
              error={state.error.includes('NAME') || state.responseError}
              helperText={
                state.error.includes('NAME') ? 'Nazwa grupy jest wymagana' : state.responseError
              }
              value={state.name}
              onChange={(e) => {
                dispatch({ type: 'set', field: 'name', value: e.target.value });
                dispatch({ type: 'remove', field: 'error', value: 'NAME' });
              }}
              required
              fullWidth
            />
          </div>
          <div css={CreateGroupStyles.select}>
            <Autocomplete
              disablePortal
              multiple
              options={state.users}
              value={state.addedUsers}
              onChange={(event, newValue) => {
                dispatch({ type: 'set', field: 'addedUsers', value: newValue });
                dispatch({ type: 'remove', field: 'error', value: 'USERS' });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Dodaj użytkowników'
                  error={state.error.includes('USERS')}
                />
              )}
              fullWidth
            />
          </div>
          <div css={CreateGroupStyles.buttons}>
            <Button onClick={() => navigate('/dashboard/groups/')}>Wróć</Button>
            <LoadingButton
              variant='contained'
              loading={loading}
              loadingPosition='start'
              startIcon={<MdGroupAdd />}
              onClick={() => createGroup()}
            >
              {document.body.clientWidth <= 480 ? 'Utwórz' : 'Utwórz grupę'}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateGroup;
