/** @jsxImportSource @emotion/react */
import { Tooltip } from '@mui/material';
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
  function showLinks() {
    switch (window.location.pathname.split('/')[2]) {
      case 'messages':
        return (
          <div css={HeaderStyles.links(theme)}>
            <a href='/dashboard/groups'>Groups</a>
            <a href='/dashboard/panel'>Users</a>
          </div>
        );
      case 'groups':
        return (
          <div css={HeaderStyles.links(theme)}>
            <a href='/dashboard/messages'>Messages</a>
            <a href='/dashboard/panel'>Users</a>
          </div>
        );
      case 'panel':
        return (
          <div css={HeaderStyles.links(theme)}>
            <a href='/dashboard/messages'>Messages</a>
            <a href='/dashboard/groups'>Groups</a>
          </div>
        );
      default:
        return null;
  }
  }

  return (
    <div css={HeaderStyles.header}>
      <div css={HeaderStyles.container(theme)}>
        <div css={HeaderStyles.content}>
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
          <div css={HeaderStyles.actions}>
            {showLinks()}
            <div css={HeaderStyles.buttons}>
              <Tooltip title={`Tryb ${theme === 'dark' ? 'jasny' : 'ciemny'}`}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
