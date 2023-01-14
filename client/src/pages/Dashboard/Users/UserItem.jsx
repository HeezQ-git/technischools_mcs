import { useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { Tooltip } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { delay, formatPhoneNumber } from '../../../utils/functions';
import { Mail, Phone, Edit, Trash} from 'react-feather';
import { UsersStyles } from './users.styles';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';

const UserItem = ({ user, getUsers, setAllUsers }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('Usuń');
  const [copyTitle, setCopyTitle] = useState('Skopiuj');
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const {theme} = useContext(ThemeContext);


  const deleteUser = async (user) => {
    if (confirmDelete) {
      setDeleteTitle('Usuwam...');

      const res = await UsersService.deleteUser({ id: user.id });
      if (res.data.success) {
        setDeleteTitle('Usunięto!');
        setAllUsers((prev) => prev.filter((e) => e.id !== user.id));
        getUsers();
      }
    } else {
      setDeleteTitle('Kliknij, aby potwierdzić');
      setConfirmDelete(true);
    }
  };

  const copied = async () => {
    setCopyTitle('Skopiowano!');
    await delay(500);
    setCopyTitle('Skopiuj');
  };

  return (
    <div 
      css={UsersStyles.usersContainer}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div css={UsersStyles.user(theme)}>
        <div css={UsersStyles.userItems}>
          {user.name} {user.surname}
          {(user.email || user.phone_number) && (
            <div css={UsersStyles.onHoverInfo(hover)}>
              {user.email && (
                <p css={css`display: flex; align-items: center; gap: 8px;`}> 
                  <Mail size={17} />

                  <CopyToClipboard
                    css={css`cursor: pointer;`}
                    onCopy={() => copied()}
                    text={user.email}
                  > 
                    <Tooltip title={copyTitle}>
                      <span>
                        {user.email.split('@')[0]}
                        <wbr />@{user.email.split('@')[1]}
                      </span>
                    </Tooltip>
                  </CopyToClipboard>
                </p>
              )}
              {user.phone_number && (
                <p css={css`display: flex; align-items: center; gap: 8px;`}> 
                  <Phone size={17} />
                  <CopyToClipboard
                    css={css`cursor: pointer;`} 
                    onCopy={() => copied()}
                    text={user.phone_number}
                  > 
                    <Tooltip title={copyTitle}>
                      <span>
                        {user.phone_number.startsWith('+48')
                          ? user.phone_number
                          : `+48 ${formatPhoneNumber(user.phone_number)}`}
                      </span>
                    </Tooltip>
                  </CopyToClipboard>
                </p>
              )}
            </div>
          )}
        </div>
        <div css={UsersStyles.icons(hover)}>
          <Tooltip title='Edytuj'>
            <div
              size={'small'}
              css={UsersStyles.icon(theme)}
              onClick={() => navigate(`/dashboard/edit-user/${user.id}`)}
            >
              <span>
                <Edit size={18} />
              </span>
            </div>
          </Tooltip>
          <Tooltip title={deleteTitle}>
            <div
              size={'small'}
              css={UsersStyles.icon(theme)}
              onClick={() => deleteUser(user)}
              onMouseLeave={() => {
                setDeleteTitle('Usuń');
                setConfirmDelete(false);
              }}
            >
              <span>
                <Trash size={18} />
              </span>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
  
export default UserItem;