/** @jsxImportSource @emotion/react */
import { Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import { Tooltip } from '@mui/material';
import { delay } from '../../../utils/functions';
import { MdPersonAdd, MdRefresh } from 'react-icons/md';
import { CgSearch } from 'react-icons/cg';
import { Pagination } from '@mui/material';
import Items from './Items';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { PanelStyles } from './panel.styles';
import { css } from '@emotion/react';

const usersPerPage = 10;

const Panel = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [copyTitle, setCopyTitle] = useState('Skopiuj');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const searchUser = (data) => {
    data = data.toLowerCase();

    const filteredUsers = 
      allUsers.filter(
        (e) =>
          e.name.toLowerCase().includes(data) ||
          e.surname.toLowerCase().includes(data) ||
          e.email?.toLowerCase()?.includes(data) ||
          false ||
          e.phone_number?.toLowerCase()?.includes(data) ||
          false ||
          `${e.name.toLowerCase()} ${e.surname.toLowerCase()}`.includes(data) ||
          `${e.surname.toLowerCase()} ${e.name.toLowerCase()}`.includes(data)
      );
    setFilteredUsers(filteredUsers);
    setPage(1);
  };

  const copied = async () => {
    setCopyTitle('Skopiowano!');
    await delay(500);
    setCopyTitle('Skopiuj');
  };

  const getUsersPerPage = async (page) => {
    setLoading(true);
    const res = await UsersService.getUsersPerPage({skip: usersPerPage*(page-1) , take: usersPerPage});
    if (res.data.success) {
      setCurrentItems(res.data.users);
    }
    setLoading(false);
  };

  const getUsers = async () => {
    setLoading(true);
    const res = await UsersService.getAllUsers();
    if (res.data.success) {
      setAllUsers(res.data.users);
      setFilteredUsers(res.data.users);
    }

    getUsersPerPage(page);

  };
  
  useEffect(() => {
    getUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={PanelStyles.panel}>
      <div css={PanelStyles.container(theme)}>
        <p css={css`font-weight: 600`}>Lista użytkowników w bazie:</p>
        <div css={PanelStyles.searchBar}>
          <Tooltip title='Odśwież'>
            <span
              css={css`font-size: 20px; cursor: pointer;`}
              onClick={() => getUsers()}
            >
              <MdRefresh css={PanelStyles.loader(loading)} size={25} />
            </span>
          </Tooltip>
          <Input
            size='small'
            starticon={<CgSearch />}
            placeholder='Szukaj...'
            onChange={(e) => searchUser(e.target.value)}
          />
        </div>
        <div css={PanelStyles.users}>
          {!!currentItems.length && !loading ? (
              <Items
                currentItems={filteredUsers.length === allUsers.length ? currentItems : 
                  filteredUsers}
                
                copyTitle={copyTitle}
                copied={copied}
                getUsers={getUsers}
                navigate={navigate}
                theme={theme}
              />
          ) : (
          loading ? (<div css={PanelStyles.loading}>
              <span>Ładuję listę użytkowników...</span>
            </div>)
            : (
              <div css={css`margin: 24px 4px;`}>
                <Typography component='span' className='select-none opacity-80'>
                  Brak użytkowników w bazie
                </Typography>
              </div>
            )
          )}
        </div>
        <div css={PanelStyles.usersCount}>
          {currentItems && (
            <span css={PanelStyles.userCountText}>
              {document.body.clientWidth <= 480 ?  
              `${allUsers.length} użytk.`: 
              `Znaleziono ${allUsers.length} użytkowników`}
            </span>
          )}
          {!!currentItems.length && <div css={PanelStyles.pagination}>
            <Pagination
              css={css`display: flex; align-items: center`}
              shape='rounded'
              size={document.body.clientWidth <= 480 ? 'small' : 'medium'}
              siblingCount={document.body.clientWidth <= 480 ? 0 : 1}
              count={ filteredUsers.length === allUsers.length ?
                Math.ceil(allUsers.length / usersPerPage) : 1
              }
              page={page}
              onChange={(e, p) => {
                setPage(p);
                getUsersPerPage(p);            
              }}
            />
          </div>}
          <Button
            variant='text'
            startIcon={<MdPersonAdd />}
            onClick={() => navigate('/dashboard/add-user')}
          >
            {document.body.clientWidth <= 540 ? 'Dodaj' : 'Dodaj użytkownika'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
