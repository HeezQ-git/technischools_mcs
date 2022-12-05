/** @jsxImportSource @emotion/react */
import { Container, Button } from '@mui/material';
import { useEffect, useReducer } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { ManageUserStyles } from './manageUser.styles';
import Input from '../../../components/Input/Input';
import { LoadingButton } from '@mui/lab';
import { MdPersonAddAlt } from 'react-icons/md';
import { ThemeContext } from '../../../App';
import { useContext } from 'react';
import { reducer, initialManageUserState } from '../../../utils/reducer';

const ManageUser = () => {
  const [state, dispatch] = useReducer(reducer, initialManageUserState);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
      if (id) {
      const res = await UsersService.getUser({ id });
      if (res.data.success) {
        const user = res.data.user;
        dispatch({ type: 'set', field: 'name', value: user.name });
        dispatch({ type: 'set', field: 'surname', value: user.surname });
        dispatch({ type: 'set', field: 'email', value: user.email });
        dispatch({ type: 'set', field: 'phone_number', value: user.phone_number });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const manageUser = async () => {
    if (!state.name) return dispatch({ type: 'add', field: 'error', value: 'NAME' });
    else if (!state.surname) return dispatch({ type: 'add', field: 'error', value: 'SURNAME' });
    else if (!state.email) return dispatch({ type: 'add', field: 'error', value: 'EMAIL' });
    else if (!state.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) return dispatch({ type: 'add', field: 'error', value: 'EMAIL SYNTAX' });
    if (state.phone_number && state.phone_number.length !== 9) return dispatch({ type: 'add', field: 'error', value: 'PHONE_NUMBER' });
    dispatch({ type: 'set', field: 'error', value: [] });
    dispatch({ type: 'set', field: 'loading', value: true });    

    const res = id ? await UsersService.editUser({
      id,
      name: state.name,
      surname: state.surname,
      email: state.email,
      phone_number: state.phone_number,
    }) : await UsersService.addUser({
      name: state.name,
      surname: state.surname,
      email: state.email,
      phone_number: state.phone_number,
    });

    if (res.data.success) navigate(-1);
    else dispatch({ type: 'set', field: 'responseError', value: res.data.message });
    dispatch({ type: 'set', field: 'loading', value: false });
  };

  return (
    <Container
      css={ManageUserStyles.wrapper}
      maxWidth='sm'
    >
      <div css={ManageUserStyles.container(theme)}>
        <div css={ManageUserStyles.box}>
          <h1 css={ManageUserStyles.title}>
            {id ? 'Edytuj użytkownika' : 'Dodaj użytkownika'}
          </h1>
          <div css={ManageUserStyles.names}>
            <Input
              placeholder='Imię'
              label='Imię'
              error={state.error.includes('NAME')}
              helperText={state.error.includes('NAME') && 'Imię jest wymagane'}
              value={state.name}
              onChange={(e) => {
                dispatch({ type: 'set', field: 'name', value: e.target.value });
                dispatch({ type: 'remove', field: 'error', value: 'NAME' });
              }}
              required
            />
            <Input
              placeholder='Nazwisko'
              label='Nazwisko'
              error={state.error.includes('SURNAME')}
              helperText={state.error.includes('SURNAME') && 'Nazwisko jest wymagane'}
              value={state.surname}
              onChange={(e) => {
                dispatch({ type: 'set', field: 'surname', value: e.target.value });
                dispatch({ type: 'remove', field: 'error', value: 'SURNAME' });
              }}
              required
            />
          </div>
          
          <Input
            placeholder='Adres email'
            label='Adres email'
            value={state.email}
            error={state.error.includes('EMAIL') || state.error.includes('EMAIL SYNTAX') || !!state.responseError}
            // eslint-disable-next-line no-mixed-operators
            helperText={(state.error.includes('EMAIL') && 'Adres email jest wymagany') 
              || (state.error.includes('EMAIL SYNTAX') && 'Adres email jest niepoprawny')
              || (state.responseError && 'Adres email jest już zajęty')}
            onChange={(e) => {
              dispatch({ type: 'set', field: 'email', value: e.target.value });
              dispatch({ type: 'remove', field: 'error', value: 'EMAIL' });
            }}
            required
            fullWidth
          />
          <Input
            placeholder='Numer telefonu'
            label='Numer telefonu'
            type='number'
            error={state.error.includes('PHONE_NUMBER')}
            helperText={state.error.includes('PHONE_NUMBER') && 'Numer telefonu powinien zawierać 9 cyfr'}
            value={state.phone_number}
            onChange={(e) => dispatch({ type: 'set', field: 'phone_number', value: e.target.value })}
            fullWidth
          />
          <div css={ManageUserStyles.buttons}>
            <Button onClick={() => navigate(-1)}>Wróć</Button>
            <LoadingButton
              variant={document.body.clientWidth <= 480 ? 'text' : 'contained'}
              loading={state.loading}
              loadingPosition='start'
              startIcon={<MdPersonAddAlt />}
              onClick={() => manageUser()}
            >
              {document.body.clientWidth <= 480 ? `${id ? 'Edytuj' : 'Dodaj'}` : `${id ? 'Edytuj' : 'Dodaj'} użytkownika`}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ManageUser;
