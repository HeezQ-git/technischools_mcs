/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { Tooltip, IconButton } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber } from '../../../utils/functions';
import {
  MdDelete,
  MdEdit,
  MdMail,
  MdPhone,
} from 'react-icons/md';
import { PanelStyles } from './panel.styles';
import { css } from '@emotion/react';

const Items = ({ currentItems, copyTitle, copied, getUsers, navigate, theme }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTitle, setDeleteTitle] = useState('Usuń');
    const [hover, setHover] = useState(null);

    const deleteUser = async (user) => {
      if (confirmDelete) {
        setDeleteTitle('Usuwam...');
  
        const res = await UsersService.deleteUser({ id: user.id });
  
        if (res.data.success) {
          setDeleteTitle('Usunięto!');
          getUsers();
        }
      } else {
        setDeleteTitle('Kliknij, aby potwierdzić');
        setConfirmDelete(true);
      }
    };
    return (
      <div css={PanelStyles.users}>
        {currentItems.map((user, index) => (
          <div key={index} 
            css={PanelStyles.usersContainer}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
            >
            <div css={PanelStyles.user(theme)}>
              <div css={PanelStyles.userItems}>
                {user.name} {user.surname}
                {(user.email || user.phone_number) && (
                  <div css={PanelStyles.onHoverInfo(index === hover)}>
                    {user.email && (
                      <p css={css`display: flex; align-items: center; gap: 8px;`}> 
                        <MdMail size={19} />
  
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
                        <MdPhone size={19} />
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
              <div css={PanelStyles.icons(index === hover)}>
                <Tooltip title='Edytuj'>
                  <IconButton
                    size={'small'}
                    onClick={() => navigate(`/dashboard/edit-user/${user.id}`)}
                  >
                    <span>
                      <MdEdit size={21} />
                    </span>
                  </IconButton>
                </Tooltip>
                <Tooltip title={deleteTitle}>
                  <IconButton
                    size={'small'}
                    onClick={() => deleteUser(user)}
                    onMouseLeave={() => {
                      setDeleteTitle('Usuń');
                      setConfirmDelete(false);
                    }}
                  >
                    <span>
                      <MdDelete size={21} />
                    </span>
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
};
  
export default Items;