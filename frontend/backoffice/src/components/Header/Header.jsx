/** @jsxImportSource @emotion/react */
import { Grid, Tooltip } from '@mui/material';
import logo_dark from './../../assets/images/techni_logo_white.png';
import logo_light from './../../assets/images/techni_logo_purple.png';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { HeaderStyles } from './header.styles';
import { LoginService } from '../../services/login.service';
import { css } from '@emotion/react';

const Header = ({ theme, changeTheme }) => {
   const navigate = useNavigate();

  const logout = async () => {
    const res = await LoginService.logout();
    if (res.data.success) {
      navigate('/');
    }
  };
  return (
    <div css={HeaderStyles.header}>
      <div css={HeaderStyles.container(theme)}>
        <Grid css={HeaderStyles.content}>
          <img
            css={HeaderStyles.logo}
            src={theme === 'dark' ? logo_dark : logo_light}
            style={{ filter: !theme && 'brightness(0)' }}
            draggable='false'
            onClick={() => {
              window.location.pathname = '/dashboard';
            }}
            alt="logo"
          />
          <div css={HeaderStyles.buttons}>
            <Tooltip title={`Tryb ${theme ? 'jasny' : 'ciemny'}`}>
              <div css={HeaderStyles.darkmode} onClick={() => changeTheme()}>
                <div css={HeaderStyles.spacing}>
                  <div css={HeaderStyles.toggleSwitch(theme === 'dark')}>
                    <svg
                      width='19px'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 496 496'
                    >
                      <path
                        fill={theme === 'dark' ? '#fff' : '#000'}
                        d='M8,256C8,393,119,504,256,504S504,393,504,256,393,8,256,8,8,119,8,256ZM256,440V72a184,184,0,0,1,0,368Z'
                        transform='translate(-8 -8)'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Tooltip>
            <Tooltip title='Wyloguj się'>
              <div
                css={css`cursor: pointer; color: ${theme === 'dark' ? '#fff' : '#000'};`}
                onClick={() => logout()}
              >
                <MdLogout size={22} />
              </div>
            </Tooltip>
          </div>
          {/* <div>
            <select>
              <option>&#9728;&#65039;</option>
              <option>&#127769;</option>
              <option>&#128421;&#65039;</option>
              na discordzie wyśle ci o co mi chodzi
              https://tailwindcss.com/docs/installation patrz
            </select>
          </div> */}
        </Grid>
      </div>
    </div>
  );
};

export default Header;
