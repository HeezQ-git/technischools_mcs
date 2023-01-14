import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import { HeaderStyles } from './header.styles';
import { AuthService } from '../../services/auth.service';
import { useContext, useState } from 'react';
import { LogOut, Menu, X, Sun, Moon, Users, Folder, MessageCircle, Terminal } from 'react-feather';
import { useWindowSize } from '../../hooks/useWindowSize';
import { usePageHandler } from '../../hooks/usePageHandler';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../App';
import Logo from '../Logo/Logo';

const Header = ({ changeTheme, isAdmin }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { currentPage } = usePageHandler();
  const navigate = useNavigate();
  const { isTablet } = useWindowSize();
  const adminTitle = isTablet ? <Terminal size={19} /> : 'Panel admina';
  const groupTitle = isTablet ? <Folder size={19} /> : 'Grupy';
  const usersTitle = isTablet ? <Users size={19} /> : 'Użytkownicy';
  const messagesTitle = isTablet ? <MessageCircle size={19} /> : 'Wiadomości';

  const logout = async () => {
    const res = await AuthService.logout();
    if (res.data.success) {
      navigate('/');
    }
  };

  return (
    <div
      css={HeaderStyles.container(theme, menuOpened)}
    >
      <div css={HeaderStyles.content}>
        <div onClick={() => navigate('/dashboard')}>
          <Logo size={32} />
        </div>
        <div
          css={HeaderStyles.hamburger(theme)}
          onClick={() => setMenuOpened(prev => !prev)}
        >
          {!menuOpened ? <Menu size={20} /> : <X size={20} />}
        </div>
        <div css={HeaderStyles.actions(menuOpened)}>
          <div css={HeaderStyles.links(theme, currentPage)}>
            <Link to='/dashboard/users'>{usersTitle}</Link>
            <Link to='/dashboard/groups'>{groupTitle}</Link>
            <Link to='/dashboard/messages'>{messagesTitle}</Link>
            {isAdmin && <Link to='/dashboard/admin'>{adminTitle}</Link>}
          </div>
          <div css={HeaderStyles.buttons}>
            <Tooltip title={`Zmień tryb na ${theme === 'dark' ? 'jasny' : 'ciemny'}`}>
              <div css={HeaderStyles.toggleSwitch(theme)}>
                {theme === 'light' ? (
                  <Sun size={19} onClick={() => changeTheme()} />
                ) : (
                  <Moon size={19} onClick={() => changeTheme()} />
                )}
              </div>
            </Tooltip>
            <Tooltip title='Wyloguj się'>
              <div
                css={HeaderStyles.logout(theme)}
                onClick={() => logout()}
              >
                <LogOut size={19} />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
