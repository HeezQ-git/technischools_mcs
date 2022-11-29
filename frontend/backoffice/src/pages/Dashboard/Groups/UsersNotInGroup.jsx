/** @jsxImportSource @emotion/react */
import { GroupsService } from '../../../services/groups.service';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber, delay } from '../../../utils/functions';
import { useState } from 'react';
import { Tooltip } from '@mui/material';
import {
  MdPhone,
  MdAdd,
  MdExpandMore,
} from 'react-icons/md';
import { HiMail } from 'react-icons/hi';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { css } from '@emotion/core';
import { GroupsStyles, UserItemStyles } from './groups.styles';
import { GroupsContext } from './Groups';

const UsersNotInGroup = ({ openSection, opened }) => {
    const [copyTitle, setCopyTitle] = useState('Skopiuj');
    const [isUserOpened, setUserOpened] = useState([false, null]);
    const {theme} = useContext(ThemeContext);
    const { groupState, dispatch, chosenGroup, tablet } = useContext(GroupsContext);

    const copied = async () => {
        setCopyTitle('Skopiowano!');
        await delay(500);
        setCopyTitle('Skopiuj');
    };
        
    const addToGroup = async (groupId, user) => {
        dispatch({type: 'add', field: 'currentUsers', value: user});
        await GroupsService.addToGroup({ groupId, userId: user.id });
      };
    return (
        <div css={GroupsStyles.usersListContainer(theme, 'out')}>
                <div
                    css={GroupsStyles.userListsTitles(!chosenGroup)}
                    onClick={() => openSection(2)}
                >
                    <h2 css={GroupsStyles.userListsTitle(theme)}>
                    {tablet ? 'Dodaj' : 'Dodaj do grupy'}
                    </h2>
                    {tablet && chosenGroup ? (
                    <h2 css={GroupsStyles.userListsTitle(theme, opened)}>
                        <MdExpandMore size={26} className='icon' />
                    </h2>
                    ) : null}
                </div>
                <div css={GroupsStyles.userItemsList(opened)}>
                    {opened &&
                    chosenGroup &&
                    groupState.users
                    .filter((_) => !groupState.currentUsers.find((user) => user.id === _.id))
                    .filter((_) => groupState.filteredUsers.length ? groupState.filteredUsers.find((user) => user.id === _.id) : true)
                    .map((user, index) => {
                        return (
                            <div
                                css={UserItemStyles.container(isUserOpened[0] && isUserOpened[1] === user.id)}
                                key={index}
                            >
                            <span css={[UserItemStyles.item(theme, isUserOpened[0] && isUserOpened[1] === user.id), UserItemStyles.addToGroup(isUserOpened[0] && isUserOpened[1] === user.id)]}>
                                <div css={css`display: flex; align-items: center; justify-content: between; width: 100%;`}>
                                <h4
                                    onClick={() => {
                                    if (!isUserOpened[0])
                                        return setUserOpened([true, user.id]);
                                    if (user.id !== isUserOpened[1])
                                        setUserOpened([isUserOpened[0], user.id]);
                                    else
                                        setUserOpened([!isUserOpened[0], user.id]);
                                    }}
                                    css={css`width: 100%;`}
                                >
                                    {user.name} {user.surname}
                                </h4>
                                <Tooltip title='Dodaj'>
                                    <h2
                                    onClick={() =>
                                        addToGroup(chosenGroup.id, user)
                                    }
                                    css={css`user-select: none; margin-left: auto;`}
                                    >
                                    <MdAdd size={21} />
                                    </h2>
                                </Tooltip>
                                </div>
                                {isUserOpened[0] && isUserOpened[1] === user.id && (
                                <div css={UserItemStyles.info(isUserOpened[0] && isUserOpened[1] === user.id)}>
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
                                            {user.phone_number.startsWith('+48')
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
                        );
                        })}
                </div>
        </div>
  );
};

export default UsersNotInGroup;
