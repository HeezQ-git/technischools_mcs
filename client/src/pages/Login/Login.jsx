import { useState, useEffect } from 'react';
import { LoginStyles } from './login.styles';
import { AuthService } from '../../services/auth.service';
import { Box, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Input from '../../components/Input/Input';
import { useForm } from '../../hooks/useForm';
import { useNavigate } from 'react-router';
import Logo from '../../components/Logo/Logo';

const initialValues = {
  username: '',
  password: '',
};

const validationValues = {
  username: (value) => ({
    pattern: value.length > 0,
    message: 'Proszę wpisać login',
  }),
  password: (value) => ({
    pattern: value.length > 0,
    message: 'Proszę wpisać hasło',
  }),
};

const Login = ({ theme, refreshAdmin }) => {
  const { values, handleChange, checkValidation, errors, addError } = useForm(initialValues);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = async () => {
    const isValid = checkValidation(validationValues);
    if (!isValid) return;
    setLoading(true);

    const res = await AuthService.login({ username: values.username, password: values.password });

    if (res.data.success) {
      navigate('/dashboard');
      refreshAdmin();
    } else {
      const errors = res.data.errors;
      Object.keys(errors).forEach(key => {
        if (errors[key].isError) addError(errors[key].name, errors[key].message)
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const res = await AuthService.checkSession();
      if (res.data.success) navigate('/dashboard');
    })();
  });

  return (
    <Container css={LoginStyles.loginMain} maxWidth='xs'>
      <Box css={LoginStyles.loginCenter}>
        <div css={LoginStyles.login(theme)}>
          <Logo size={40} />

          <Typography css={LoginStyles.title} component='span'>
            Logowanie
          </Typography>
          <div css={LoginStyles.inputs}>
            <Input
              value={values.user}
              name='username'
              placeholder='Twój login'
              error={!!errors.username}
              helperText={errors.username}
              onChange={(e) => handleChange(e)}
              label='Login'
              fullWidth
            />
            <Input
              value={values.password}
              name='password'
              placeholder='Twoje hasło'
              error={!!errors.password}
              helperText={errors.password}
              onChange={(e) => handleChange(e)}
              label='Hasło'
              password={'true'}
              onKeyDown={(e) =>
                `${e.code}`.toLowerCase() === 'enter' && login()
              }
              fullWidth
            />
          </div>
          <div css={LoginStyles.button}>
            <LoadingButton
              loading={loading}
              variant='contained'
              onClick={() => login()}
            >
              Zaloguj się
            </LoadingButton>
          </div>
        </div>
      </Box>
    </Container>
  );
};

export default Login;
