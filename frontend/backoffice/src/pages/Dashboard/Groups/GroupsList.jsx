/** @jsxImportSource @emotion/react */
import { GroupsService } from '../../../services/groups.service';
import { useEffect, useState } from 'react';
import { Tooltip, CircularProgress } from '@mui/material';
import {
  MdDelete,
  MdEdit,
  MdSave,
  MdCancel,
  MdAdd,
} from 'react-icons/md';
import { CgSearch } from 'react-icons/cg';
import Input from '../../../components/Input/Input';
import { BrowserView, MobileView } from 'react-device-detect';
import { GroupsStyles, GroupItemStyles, } from './groups.styles';
import { useContext } from 'react'
import { ThemeContext } from '../../../App';
import { css } from '@emotion/core';
import { GroupsContext } from './Groups';
import { useNavigate } from 'react-router-dom';

const GroupsList = ({ scrollToUserList, getGroups }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [hoverGroup, setHoverGroup] = useState(null);
  const [groupsUsers, setGroupsUsers] = useState([]);

  const {theme} = useContext(ThemeContext);
  const navigate = useNavigate();
  const {groupState, chosenGroup, setChosenGroup} = useContext(GroupsContext);

  const loadGroupsUsers = async () => {
    const res = await GroupsService.getAllGroupsUsers();
    setGroupsUsers(res.data);
  };

  const removeGroup = async (id) => {
      if (!editing[0] || editing[1] !== id) {
      await GroupsService.deleteGroup({ id: id });

      getGroups();
      setChosenGroup(null);
      } else {
      if (!editing[0]) return setEditing([true, id]);
      if (id !== editing[1]) setEditing([editing[0], id]);
      else setEditing([!editing[0], id]);
      }
  };

  const editGroup = async (id) => {
    setLoading(true);

    if (!editing[0] || editing[1] !== id) setEditing([!editing[0], id]);
    else if (newName) {
      await GroupsService.editGroup({ id, name: newName });

      getGroups();
      if (!editing[0]) return setEditing([true, id]);
      if (id !== editing[1]) setEditing([editing[0], id]);
      else setEditing([!editing[0], id]);
    }

    setLoading(false);
  };

  const searchGroup = async (data) => {
    if (!groupState.groups.length) return;

    data = data.toLowerCase();

    const foundGroups = [];
    
    for await (const group of groupState.groups) {
      const groupsUser = groupsUsers.filter((groupUser) => groupUser.group_id === group.id);
      if (
        group.name.toLowerCase().includes(data) ||
        (groupState.groups.indexOf(group) + 1).toString() === data ||
        !!groupsUser.filter( 
          (u) =>
            `${u.name.toLowerCase()} ${u.surname.toLowerCase()}`.includes(data) ||
            `${u.surname.toLowerCase()} ${u.name.toLowerCase()}`.includes(data)
        ).length
      ) foundGroups.push(group);
    }
  
    setFilteredGroups(foundGroups);
  };
  
  useEffect(() => {
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    setFilteredGroups([]);
    loadGroupsUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupState.groups]);
  
  return (
        <div css={GroupsStyles.groupsListContainer(theme)}>
          <div css={GroupsStyles.groupsListSearch}>
            <Input
              size='small'
              starticon={<CgSearch />}
              placeholder='Szukaj grupy...'
              onChange={(e) => searchGroup(e.target.value)}
              onFocus={() => loadGroupsUsers()}
            />
            <Tooltip title='Utwórz grupę'>
              <a href='/dashboard/create-group'>
                <MdAdd css={[GroupsStyles.textPrimary(theme), GroupsStyles.icon(theme)]} size={25} />
              </a>
            </Tooltip>
          </div>
          <div css={GroupsStyles.groupsList}>
            {loading && !groupState.groups && (
              <div css={GroupsStyles.groupsListLoader}>
                <CircularProgress /> <span>Ładuję grupy...</span>
              </div>
            )}
            {groupState.groups
            .filter((e) => !filteredGroups.length || filteredGroups.find((f) => f.id === e.id))
            .map((group, index) => {
              return (
                <div css={GroupItemStyles.container} key={index}>
                  <div css={GroupItemStyles.groupItem}>
                    <div 
                        css={GroupItemStyles.groupItemMain(theme, chosenGroup && chosenGroup.id === group.id)}
                        onMouseEnter={() => setHoverGroup(group.id)}
                        onMouseLeave={() => setHoverGroup(null)}
                    > 
                      <BrowserView css={GroupItemStyles.groupItemNames}>
                        <div
                          css={GroupItemStyles.groupItemNames}
                          onClick={() => {
                            if (editing[0]) return;
                            setChosenGroup(group);
                            navigate(`/dashboard/groups/${group.id}`);
                            scrollToUserList();
                          }}
                        >
                          <h2>
                            {groupState.groups.indexOf(group) + 1}.{' '}
                            {!editing[0] || editing[1] !== group.id ? (
                              group.name
                            ) : (
                              <Input
                              css={GroupItemStyles.renameInput}
                                size='small'
                                placeholder={group.name}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) =>
                                  `${e.code}`.toLowerCase() === 'enter' &&
                                  editGroup(group.id)
                                }
                              />
                            )}
                          </h2>
                        </div>
                      </BrowserView>
                      <MobileView css={[GroupItemStyles.groupItemNames, css`user-select: none`]}>
                        <div
                          css={GroupItemStyles.groupItemNames}
                          onDoubleClick={() => {
                            if (editing[0]) return;
                            setChosenGroup(group);
                            scrollToUserList();
                          }}
                        >
                          <h2>
                            {groupState.groups.indexOf(group) + 1}.{' '}
                            {!editing[0] || editing[1] !== group.id ? (
                              group.name
                            ) : (
                              <Input
                                css={GroupItemStyles.renameInput}
                                size='small'
                                placeholder={group.name}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) =>
                                  `${e.code}`.toLowerCase() === 'enter' &&
                                  editGroup(group.id)
                                }
                              />
                            )}
                          </h2>
                        </div>
                      </MobileView>
                      {!editing[0] || editing[1] !== group.id ? (
                        <div 
                            css={GroupItemStyles.groupItemButtons(chosenGroup && chosenGroup.id === group.id, hoverGroup === group.id, editing[0] && editing[1] === group.id)}
                        >
                          <Tooltip title='Edytuj'>
                            <h2 onClick={() => editGroup(group.id)}>
                              <MdEdit size={19} className='icon' />
                            </h2>
                          </Tooltip>
                          <Tooltip title='Usuń'>
                            <h2 onDoubleClick={() => removeGroup(group.id)}>
                              <MdDelete size={19} className='icon' />
                            </h2>
                          </Tooltip>
                        </div>
                      ) : (
                        <div 
                            css={GroupItemStyles.groupItemButtons(chosenGroup && chosenGroup.id === group.id, hoverGroup === group.id, editing[0] && editing[1] === group.id)}
                        >
                          <Tooltip title='Zapisz'>
                            <h2 onClick={() => editGroup(group.id)}>
                              <MdSave size={20} className='icon' />
                            </h2>
                          </Tooltip>
                          <Tooltip title='Anuluj'>
                            <h2 onClick={() => removeGroup(group.id)}>
                              <MdCancel size={20} className='icon' />
                            </h2>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div> 

  );
};

export default GroupsList;
