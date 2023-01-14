import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { createContext, createRef, useEffect, useMemo, useReducer, useState } from 'react';
import Input from '../../../components/Input/Input';
import { GroupsStyles } from './groups.styles';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import GroupsList from './GroupsList';
import UsersInGroup from './UsersInGroup';
import UsersNotInGroup from './UsersNotInGroup';
import { reducer } from '../../../utils/reducer';
import { useParams } from 'react-router-dom';
import { useWindowSize } from '../../../hooks/useWindowSize';

export const GroupsContext = createContext()

const initialState = {
  groups: [],
  users: [],
  currentUsers: [],
  openedListSection: true,
  openedAddSection: true,
};

const Groups = ({ openGroup }) => {
  const [groupState, dispatch] = useReducer(reducer, initialState);
  const [chosenGroup, setChosenGroup] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {theme} = useContext(ThemeContext);
  const userListRef = createRef();
  const { id } = useParams();
  const { isTablet } = useWindowSize();

  const filteredUsers = useMemo(() => groupState.users.filter(u => {
    return u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${u.name.toLowerCase()} ${u.surname.toLowerCase()}`.includes(searchQuery.toLowerCase()) ||
    `${u.surname.toLowerCase()} ${u.name.toLowerCase()}`.includes(searchQuery.toLowerCase())
  }), [searchQuery, groupState.users]);

  const groupContextValues = {
    groupState,
    dispatch,
    chosenGroup,
    setChosenGroup,
    userListRef,
    isTablet,
    filteredUsers,
  };

  const scrollToUserList = (editing) => {
    if (editing) return;
    if (!isTablet) return;
    if (userListRef?.current) userListRef.current.scrollIntoView();
  };

  const openGroupById = async (id) => {
    const res = await GroupsService.getGroupById({id});
    if (res.data.success) setChosenGroup(res.data.group);
  };

  const getGroups = async () => {
    setLoadingGroups(true);
    const res = await GroupsService.getAllGroups();
    if (res.data.success) {
      dispatch({type: 'set', field: 'groups', value: res.data.groups});
    }
    setLoadingGroups(false);
  };

  const getUsers = async () => {
    const res = await UsersService.getAllUsers();

    if (res.data.success) {
      dispatch({type: 'set', field: 'users', value: res.data.users});
    };
  };

  const openSection = (type) => {
    if (!isTablet) return;
    if (type === 1) dispatch({type: 'set', field: 'openedListSection', value: !groupState.openedListSection});
    else dispatch({type: 'set', field: 'openedAddSection', value: !groupState.openedAddSection});
  };

  useEffect(() => {
    getGroups();
    getUsers();
    if (id) {
      openGroupById(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // loads groups and users
  useEffect(() => {
    (async () => {
      if (chosenGroup) {
        dispatch({type: 'set', field: 'currentUsers', value: chosenGroup.users});
      } else 
        dispatch({type: 'set', field: 'currentUsers', value: []});
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenGroup]); // gets groups users when group is chosen

  return (
    <GroupsContext.Provider value={groupContextValues}>
    <div css={GroupsStyles.groups}>
      <div css={GroupsStyles.container(theme)}>

        <GroupsList 
          scrollToUserList={scrollToUserList}
          getGroups={getGroups}
          loading={loadingGroups}
        />

        <div css={GroupsStyles.main}>
          <div css={GroupsStyles.mainSearch(theme)}>
            <Input
              css={GroupsStyles.mainSearchInput}
              size='small'
              search={"true"}
              placeholder='Szukaj użytkowników...'
              value={searchQuery}
              onFocus={() => {
                dispatch({type: 'set', field: 'openedListSection', value: true});
                dispatch({type: 'set', field: 'openedAddSection', value: true});            
              }}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div> 
          <div css={GroupsStyles.userLists}>
            <UsersInGroup 
              openSection={openSection} 
              opened={groupState.openedListSection}
            />
            <UsersNotInGroup 
              openSection={openSection} 
              opened={groupState.openedAddSection}              
            />
          </div> 
        </div>
      </div>
    </div>
    </GroupsContext.Provider>
  );
};

export default Groups;
