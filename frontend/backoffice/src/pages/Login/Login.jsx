import { useState, useEffect } from 'react';
/** @jsxImportSource @emotion/react */
import { LoginStyles } from './login.styles';
import { LoginService } from '../../services/login.service';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Input from '../../components/Input/Input';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { MdOutlineError } from 'react-icons/md';
import logo_dark from './../../assets/images/techni_logo_white.png';
import logo_light from './../../assets/images/techni_logo_purple.png';

const Login = ({ theme, setLoggedOut }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cookies, setCookie] = useCookies(['token']);

  const login = async () => {
    setLoading(true);

    const res = await LoginService.login({ username: user, password: pass });

    if (res.data.success) {
      window.location.pathname = '/dashboard';
    } else setError(true);

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const res = await LoginService.checkSession();
      if (res.data.success) window.location.pathname = '/dashboard';
    })();
  });

  return (
    <Container css={LoginStyles.loginMain} maxWidth='xs'>
      <Box css={LoginStyles.loginCenter}>
        <div css={LoginStyles.login(theme)}>
          <img
            src={theme === 'dark' ? logo_dark : logo_light}
            css={LoginStyles.logo}
            alt='logo'
          />

          <Typography css={LoginStyles.title} component='span'>
            Logowanie
          </Typography>
          <Grid css={LoginStyles.inputs}>
            <Input
              onChange={(e) => {
                setUser(e.target.value);
                setError(false);
              }}
              value={user}
              placeholder='Twój login'
              error={error}
              label='Login'
              fullWidth
            />
            <Input
              onChange={(e) => {
                setPass(e.target.value);
                setError(false);
              }}
              value={pass}
              placeholder='Twoje hasło'
              label='Hasło'
              error={error}
              password={'true'}
              onKeyDown={(e) =>
                `${e.code}`.toLowerCase() === 'enter' && login()
              }
              fullWidth
            />
          </Grid>
          <Typography component='span'>
            {error && (
              <p css={LoginStyles.loginError}>
                <MdOutlineError /> Nieprawidłowy użytkownik lub hasło
              </p>
            )}
          </Typography>
          <Grid css={LoginStyles.button}>
            <LoadingButton
              loading={loading}
              variant='contained'
              onClick={() => login()}
            >
              Zaloguj się
            </LoadingButton>
          </Grid>
        </div>
      </Box>
    </Container>
  );
};

export default Login;
