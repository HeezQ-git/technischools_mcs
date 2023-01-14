import { Container, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { ManageUserStyles } from './manageUser.styles';
import Input from '../../../components/Input/Input';
import { LoadingButton } from '@mui/lab';
import { UserPlus, ArrowLeft } from 'react-feather';
import { ThemeContext } from '../../../App';
import { useContext } from 'react';
import { useForm } from '../../../hooks/useForm';
import { css } from '@emotion/core';
import { useWindowSize } from '../../../hooks/useWindowSize';

const initialValues = {
  name: '',
  surname: '',
  email: '',
  phone_number: '',
}

const validationValues = {
  name: (value) => ({
    pattern: value.length > 0,
    message: 'Imię jest wymagane',
  }),
  surname: (value) => ({
    pattern: value.length > 0,
    message: 'Nazwisko jest wymagane',
  }),
  email: (value) => ({
    pattern: value.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/),
    message: 'Niepoprawny email',
  }),
  phone_number: (value) => ({
    pattern: value.match(/^[0-9]{9}$/),
    message: 'Numer telefonu powinien zawierać 9 cyfr',
  }),
}

const ManageUser = () => {
  const { values, handleChange, checkValidation, errors, clearErrors, addError, setValues } = useForm(initialValues);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const { isMobile } = useWindowSize();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
      if (id) {
      const res = await UsersService.getUser({ id });
      if (res.data.success) {
        const user = res.data.user;
        setValues({
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone_number: user.phone_number,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const manageUser = async () => {
    const isValid = checkValidation(validationValues);
    if (!isValid) return;

    setLoading(true);

    const res = id ? await UsersService.editUser({
      id,
      name: values.name,
      surname: values.surname,
      email: values.email,
      phone_number: values.phone_number,
    }) : await UsersService.addUser({
      name: values.name,
      surname: values.surname,
      email: values.email,
      phone_number: values.phone_number,
    });
  
    if (res.data.success) { clearErrors(); navigate(-1) }
    else addError(res.data.error.name, res.data.error.message);

    setLoading(false);
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
              name='name'
              error={!!errors.name}
              helperText={errors.name}
              value={values.name}
              onChange={(e) => handleChange(e)}
              required
            />
            <Input
              placeholder='Nazwisko'
              label='Nazwisko'
              name='surname'
              error={!!errors.surname}
              helperText={errors.surname}
              value={values.surname}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          
          <Input
            placeholder='Adres email'
            label='Adres email'
            name='email'
            value={values.email}
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => handleChange(e)}
            required
            fullWidth
          />
          <Input
            placeholder='Numer telefonu'
            label='Numer telefonu'
            name='phone_number'
            type='number'
            error={!!errors.phone_number}
            helperText={errors.phone_number}
            value={values.phone_number}
            onChange={(e) => handleChange(e)}
            fullWidth
          />
          <div css={ManageUserStyles.buttons}>
            <Button 
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate(-1)}
              css={css`padding-inline: 16px;`}
            >
              Wróć
            </Button>

            <LoadingButton
              variant={isMobile ? 'text' : 'contained'}
              loading={loading}
              loadingPosition='start'
              startIcon={<UserPlus size={18} />}
              onClick={() => manageUser()}
            >
              {isMobile ? `${id ? 'Edytuj' : 'Dodaj'}` : `${id ? 'Edytuj' : 'Dodaj'} użytkownika`}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ManageUser;
