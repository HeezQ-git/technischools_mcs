/** @jsxImportSource @emotion/react */
import { GroupsService } from '../../../services/groups.service';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber, delay } from '../../../utils/functions';
import { useState } from 'react';
import { Tooltip } from '@mui/material';
import {
  MdDelete,
  MdEdit,
  MdPhone,
  MdExpandMore,
} from 'react-icons/md';
import { HiMail } from 'react-icons/hi';
import { useNavigate } from 'react-router';
import { GroupsStyles, UserItemStyles } from './groups.styles';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { css } from '@emotion/core';
import { GroupsContext } from './Groups';

const UsersInGroup = ({ openSection, opened }) => {
    const [copyTitle, setCopyTitle] = useState('Skopiuj');
    const [userOpened, setUserOpened] = useState([false, null]);
    const {theme} = useContext(ThemeContext);
    const { groupState, dispatch, chosenGroup, tablet, userListRef } = useContext(GroupsContext);

    const copied = async () => {
      setCopyTitle('Skopiowano!');
      await delay(500);
      setCopyTitle('Skopiuj');
    };
    const navigate = useNavigate();
    const removeFromGroup = async (groupId, user) => {
      dispatch({type: 'remove', field: 'currentUsers', value: user});
        await GroupsService.removeFromGroup({ groupId, userId: user.id });
      };
    return (
      <div css={GroupsStyles.usersListContainer(theme, 'in')}>
              <div
                css={GroupsStyles.userListsTitles(!chosenGroup)}
                onClick={() => openSection(1)}
              >
                <h2 css={GroupsStyles.userListsTitle(theme)}>
                  W grupie
                </h2>
                {tablet && chosenGroup ? (
                <h2 css={GroupsStyles.userListsTitle(theme, opened)}>
                    <MdExpandMore size={26} className='icon' />
                </h2>
                ) : null}
              </div>
              <div ref={userListRef}></div>
              {chosenGroup ? (
                <div css={GroupsStyles.userItemsList(opened)}>
                  {opened &&
                    groupState.currentUsers
                      .filter((_) => groupState.filteredUsers.length ? groupState.filteredUsers.find((user) => user.id === _.id) : true)
                      .map((user, index) => {
                        return (
                          user && (
                            <div
                                css={UserItemStyles.container(userOpened[0] && userOpened[1] === user.id)}
                                key={index}
                            >
                              <span css={UserItemStyles.item(theme, userOpened[0] && userOpened[1] === user.id)}>
                                <h4
                                  onClick={() => {
                                    if (!userOpened[0])
                                      return setUserOpened([true, user.id]);
                                    if (user.id !== userOpened[1])
                                      setUserOpened([userOpened[0], user.id]);
                                    else setUserOpened([!userOpened[0], user.id]);
                                  }}
                                  css={css`width: 100%;`}
                                >
                                  {user ? user.name : '-'}{' '}
                                  {user
                                    ? user.surname
                                    : '-'}
                                </h4>
                                <Tooltip title='Edytuj'>
                                  <h2
                                    onClick={() =>
                                      navigate(`/dashboard/edit-user/${user.id}`)
                                    }
                                    css={css`user-select: none; margin-left: auto; opacity: 0;`}
                                  >
                                    <MdEdit size={19} className='icon' />
                                  </h2>
                                </Tooltip>
                                <Tooltip title='Usuń'>
                                  <h2
                                    onClick={() =>
                                      removeFromGroup(chosenGroup.id, user)
                                    }
                                    css={css`user-select: none; margin-left: 8px; opacity: 0;`}
                                  >
                                    <MdDelete size={19} className='icon' />
                                  </h2>
                                </Tooltip>

                                {userOpened[0] &&
                                  userOpened[1] === user.id &&
                                  user && (
                                    <div css={UserItemStyles.info(userOpened[0] && userOpened[1] === user.id)}>
                                      {user.email && (
                                        <p css={css`display: flex; align-items: center; gap: 8px;`}>
                                          <HiMail size={19} className='icon' />
                                          <CopyToClipboard
                                            css={css`cursor: pointer;`}
                                            onCopy={() => copied()}
                                            text={user.email}
                                          >
                                            <Tooltip title={copyTitle}>
                                                <span>
                                                  {user.email.split('@')[0]}
                                                  <wbr/>@
                                                  {user.email.split('@')[1]}
                                                </span>                                      
                                            </Tooltip>
                                          </CopyToClipboard>
                                        </p>
                                      )}
                                      {user.phone_number && (
                                        <p css={css`display: flex; align-items: center; gap: 8px;`}>
                                          <MdPhone size={19} className='icon' />
                                          <CopyToClipboard
                                            css={css`cursor: pointer;`}
                                            onCopy={() => copied()}
                                            text={user.phone_number}
                                          >
                                            <Tooltip title={copyTitle}>
                                              <span>
                                                { user.phone_number.startsWith('+48')
                                                  ? user.phone_number
                                                  : `+48 ${formatPhoneNumber(
                                                      user.phone_number
                                                    )}`}
                                              </span>
                                            </Tooltip>
                                          </CopyToClipboard>
                                        </p>
                                      )}
                                    </div>
                                  )}
                              </span>
                            </div>
                          )
                        );
                      })}
                </div>
              ) : (
                <h3 css={GroupsStyles.chooseGroupTitle
                }>Wybierz grupę</h3>
              )}
    </div>
  );
};

export default UsersInGroup;
