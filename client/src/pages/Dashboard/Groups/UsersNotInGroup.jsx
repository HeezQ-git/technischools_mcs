import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { GroupsStyles } from './groups.styles';
import { GroupsContext } from './Groups';
import { UserItem } from './UserItem';

const UsersNotInGroup = ({ openSection, opened }) => {
    const [userOpened, setUserOpened] = useState([false, null]);
    
    const {theme} = useContext(ThemeContext);
    const { groupState, chosenGroup, isTablet, filteredUsers } = useContext(GroupsContext);

    return (
        <div css={GroupsStyles.usersListContainer(theme, 'out')}>
                <div
                    css={GroupsStyles.userListsTitles(!chosenGroup)}
                    onClick={() => openSection(2)}
                >
                    <h2 css={GroupsStyles.userListsTitle(theme)}>
                    {isTablet ? 'Dodaj' : 'Dodaj do grupy'}
                    </h2>
                    {isTablet && chosenGroup ? (
                    <h2 css={GroupsStyles.userListsTitle(theme, opened)}>
                        <ChevronDown size={20} className='icon' />
                    </h2>
                    ) : null}
                </div>
                <div css={GroupsStyles.userItemsList(opened)}>
                    {opened &&
                    chosenGroup &&
                    groupState.users
                    .filter((_) => !groupState.currentUsers.find((user) => user.id === _.id))
                    .filter((_) => filteredUsers.length ? filteredUsers.find((user) => user.id === _.id) : true)
                    .map(user => {
                        return (
                            user && (
                              <UserItem 
                                user={user}
                                userOpened={userOpened}
                                setUserOpened={setUserOpened}
                                userNotInGroup
                                key={user.id}
                              />
                            )
                          );
                        })}
                </div>
        </div>
  );
};

export default UsersNotInGroup;
