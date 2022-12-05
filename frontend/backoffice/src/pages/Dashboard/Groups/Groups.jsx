/** @jsxImportSource @emotion/react */
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { createContext, createRef, useEffect, useReducer, useState } from 'react';
import { CgSearch } from 'react-icons/cg';
import Input from '../../../components/Input/Input';
import { GroupsStyles } from './groups.styles';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import GroupsList from './GroupsList';
import UsersInGroup from './UsersInGroup';
import UsersNotInGroup from './UsersNotInGroup';
import { reducer, initialGroupsState } from '../../../utils/reducer';
import { useParams } from 'react-router-dom';

export const GroupsContext = createContext()

const Groups = ({ openGroup }) => {
  const [tablet, isTablet] = useState(document.body.clientWidth <= 768);
  const [groupState, dispatch] = useReducer(reducer, initialGroupsState);
  const [chosenGroup, setChosenGroup] = useState(null);
  const [loadingGroups, setLoadingGroups] = useState(null);
  const {theme} = useContext(ThemeContext);
  const userListRef = createRef();
  const { id } = useParams();
  const groupContextValues = {
    groupState,
    dispatch,
    chosenGroup,
    setChosenGroup,
    userListRef,
    tablet,
  };

  const scrollToUserList = (editing) => {
    if (editing) return; // editing[0]
    if (!tablet) return;
    if (userListRef?.current) userListRef.current.scrollIntoView();
  };

  const openGroupById = async (id) => {
    const res = await GroupsService.getGroupById({id});
    if (res.data.success) {
      setChosenGroup(res.data.group);
    }
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
    if (!tablet) return;
    if (type === 1) dispatch({type: 'set', field: 'openedListSection', value: !groupState.openedListSection});
    else dispatch({type: 'set', field: 'openedAddSection', value: !groupState.openedAddSection});
  };

  const searchUser = (data) => {
    data = data.toLowerCase();
    if (data === '') return dispatch({type: 'set', field: 'filteredUsers', value: []});

    const foundUsers = groupState.users.filter(
      (e) =>
        e.name.toLowerCase().includes(data) ||
        e.surname.toLowerCase().includes(data) ||
        e.email.toLowerCase().includes(data) ||
        e.phone_number.toLowerCase().includes(data) ||
        `${e.name.toLowerCase()} ${e.surname.toLowerCase()}`.includes(data) ||
        `${e.surname.toLowerCase()} ${e.name.toLowerCase()}`.includes(data)
    );

    dispatch({type: 'set', field: 'filteredUsers', value: foundUsers});
    dispatch({type: 'set', field: 'openedListSection', value: true});
    dispatch({type: 'set', field: 'openedAddSection', value: true});
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
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenGroup]); // gets groups users when group is chosen
  useEffect(() => {
    isTablet(document.body.clientWidth <= 768);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.body.clientWidth]); // checks if screen is tablet or not

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
              starticon={<CgSearch />}
              placeholder='Szukaj użytkowników...'
              onChange={(e) => searchUser(e.target.value)}
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
