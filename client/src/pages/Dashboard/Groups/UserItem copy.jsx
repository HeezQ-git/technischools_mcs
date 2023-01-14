import { css } from '@emotion/react';
import { Tooltip } from '@mui/material';
import { useContext, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router';
import { delay, formatPhoneNumber } from '../../../utils/functions';
import { UserItemStyles } from './groups.styles';
import { Edit, Mail, Phone, Trash } from 'react-feather';
import { GroupsContext } from './Groups';
import { GroupsService } from '../../../services/groups.service';
import { ThemeContext } from '../../../App';

export const UserItem = ({user, userOpened, setUserOpened, isUserOpened, index, addToGroup}) => {
    const [copyTitle, setCopyTitle] = useState('Skopiuj');

    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext);
    const {chosenGroup, dispatch} = useContext(GroupsContext);

    const copied = async () => {
        setCopyTitle('Skopiowano!');
        await delay(500);
        setCopyTitle('Skopiuj');
      };
      const removeFromGroup = async (groupId, user) => {
        dispatch({type: 'remove', field: 'currentUsers', value: user});
          await GroupsService.removeFromGroup({ groupId, userId: user.id });
        };
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
            <Plus size={19} />
            </h2>
        </Tooltip>
        </div>
        {isUserOpened[0] && isUserOpened[1] === user.id && (
        <div css={UserItemStyles.info(isUserOpened[0] && isUserOpened[1] === user.id)}>
            {user.email && (
            <p css={css`display: flex; align-items: center; gap: 8px;`}>
                <Mail size={17} className='icon' />
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
                <Phone size={17} className='icon' />
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
    )
  
}
