import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { GroupsStyles } from './groups.styles';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { GroupsContext } from './Groups';
import { UserItem } from './UserItem';

const UsersInGroup = ({ openSection, opened }) => {
    const [userOpened, setUserOpened] = useState([false, null]);
    
    const {theme} = useContext(ThemeContext);
    const { groupState, chosenGroup, isTablet, userListRef, filteredUsers } = useContext(GroupsContext);
    
    return (
      <div css={GroupsStyles.usersListContainer(theme, 'in')}>
              <div
                css={GroupsStyles.userListsTitles(!chosenGroup)}
                onClick={() => openSection(1)}
              >
                <h2 css={GroupsStyles.userListsTitle(theme)}>
                  W grupie
                </h2>
                {isTablet && chosenGroup ? (
                <h2 css={GroupsStyles.userListsTitle(theme, opened)}>
                    <ChevronDown size={20} className='icon' />
                </h2>
                ) : null}
              </div>
              <div ref={userListRef}></div>
              {`chosenGroup` ? (
                <div css={GroupsStyles.userItemsList(opened)}>
                  {opened &&
                    groupState.currentUsers
                      .filter((_) => filteredUsers.length ? filteredUsers.find((user) => user.id === _.id) : true)
                      .map(user => {
                        return (
                          user && (
                            <UserItem 
                              user={user}
                              userOpened={userOpened}
                              setUserOpened={setUserOpened}
                              key={user.id}
                            />
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
