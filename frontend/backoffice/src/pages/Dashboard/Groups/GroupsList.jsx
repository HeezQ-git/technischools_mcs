/** @jsxImportSource @emotion/react */
import { GroupsService } from '../../../services/groups.service';
import { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';
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

const GroupsList = ({ scrollToUserList, getGroups, loading }) => {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [hoverGroup, setHoverGroup] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('Usuń');
  const [editingError, setEditingError] = useState(false);

  const {theme} = useContext(ThemeContext);
  const navigate = useNavigate();
  const {groupState, chosenGroup, setChosenGroup} = useContext(GroupsContext);

  const removeGroup = async (id) => {
        if (confirmDelete) {
          setDeleteTitle('Usuwam...');
          const res = await GroupsService.deleteGroup({id});
          if (res.data.success) {
            getGroups();
            setDeleteTitle('Usunięto!');
          }
        } else {
          setDeleteTitle('Kliknij, aby potwierdzić');
          setConfirmDelete(true);    
        }

      if (chosenGroup?.id === id) {
        setChosenGroup(null);
      }
  };

  const editGroup = async (id, prev) => {
    setEditingError(false);
    if (!editing || editing !== id) setEditing(id);    
    else if (newName && newName !== prev) {
      const res = await GroupsService.editGroup({ id, name: newName });
      if (res.data.success) {
        console.log('success');
        getGroups();
        setEditing(null);
        setNewName('');
      } else {
        console.log(res.data)
        setEditingError(true);
      }
    } else {
      setEditing(null);
    }
  };

  const searchGroup = async (data) => {
    if (!groupState.groups.length) return;

    data = data.toLowerCase();

    const foundGroups = [];
    
    for await (const group of groupState.groups) {
      if (
        group.name.toLowerCase().includes(data) ||
        (groupState.groups.indexOf(group) + 1).toString() === data ||
        !!group.users.filter( 
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
            />
            <Tooltip title='Utwórz grupę'>
              <a href='/dashboard/create-group'>
                <MdAdd css={[GroupsStyles.textPrimary(theme), GroupsStyles.icon(theme)]} size={25} />
              </a>
            </Tooltip>
          </div>
          <div css={GroupsStyles.groupsList}>
            {loading ? (
              <div css={GroupsStyles.groupsListLoader}>
                 <span>Ładuję grupy...</span>
              </div>
            ) :
            (groupState.groups
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
                            if (!!editing) return;
                            setChosenGroup(group);
                            navigate(`/dashboard/groups/${group.id}`);
                            scrollToUserList();
                          }}
                        >
                          <h2>
                            {groupState.groups.indexOf(group) + 1}.{' '}
                            {!editing || editing !== group.id ? (
                              group.name
                            ) : (
                              <Input
                              css={GroupItemStyles.renameInput}
                                size='small'
                                placeholder={group.name}
                                onChange={(e) => setNewName(e.target.value)}
                                error={editingError}
                                onKeyDown={(e) =>
                                  `${e.code}`.toLowerCase() === 'enter' &&
                                  editGroup(group.id, group.name)
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
                            if (!!editing) return;
                            setChosenGroup(group);
                            scrollToUserList();
                          }}
                        >
                          <h2>
                            {groupState.groups.indexOf(group) + 1}.{' '}
                            {!editing || editing !== group.id ? (
                              group.name
                            ) : (
                              <Input
                                css={GroupItemStyles.renameInput}
                                size='small'
                                placeholder={'name'}
                                error={editingError}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={(e) =>
                                  `${e.code}`.toLowerCase() === 'enter' &&
                                  editGroup(group.id, group.name)
                                }
                              />
                            )}
                          </h2>
                        </div>
                      </MobileView>
                      {!editing || editing !== group.id ? (
                        <div 
                            css={GroupItemStyles.groupItemButtons(chosenGroup && chosenGroup.id === group.id, hoverGroup === group.id, editing && editing === group.id)}
                        >
                          <Tooltip title='Edytuj'>
                            <h2 onClick={() => editGroup(group.id, group.name)}>
                              <MdEdit size={19} className='icon' />
                            </h2>
                          </Tooltip>
                          <Tooltip title={deleteTitle}>
                            <h2 onClick={() => removeGroup(group.id)}
                                onMouseLeave={() => {
                                  setDeleteTitle('Usuń');
                                  setConfirmDelete(false);
                                }}>
                              <MdDelete size={19} className='icon' />
                            </h2>
                          </Tooltip>
                        </div>
                      ) : (
                        <div 
                            css={GroupItemStyles.groupItemButtons(chosenGroup && chosenGroup.id === group.id, hoverGroup === group.id, editing && editing === group.id)}
                        >
                          <Tooltip title='Zapisz'>
                            <h2 onClick={() => editGroup(group.id, group.name)}>
                              <MdSave size={20} className='icon' />
                            </h2>
                          </Tooltip>
                          <Tooltip title='Anuluj'>
                            <h2 onClick={() => setEditing(null)}>
                              <MdCancel size={20} className='icon' />
                            </h2>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div> 

  );
};

export default GroupsList;
