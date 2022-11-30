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
import { getPage, paginate } from '../../../utils/pagination';
import Items from './Items';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { PanelStyles } from './panel.styles';
import { css } from '@emotion/react';

const usersPerPage = 5;

const Panel = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [page, setPage] = useState(1);
  const [copyTitle, setCopyTitle] = useState('Skopiuj');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const changePage = (num) => setCurrentItems(getPage(users, num));

  const searchUser = (data) => {
    data = data.toLowerCase();

    const filteredUsers = paginate(
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
      ),
      usersPerPage
    );

    setUsers(filteredUsers);
    setCurrentItems(getPage(filteredUsers, 1));
    setPage(1);
  };

  const copied = async () => {
    setCopyTitle('Skopiowano!');
    await delay(500);
    setCopyTitle('Skopiuj');
  };

  const getUsers = async () => {
    setLoading(true);

    //* Clearing users to remove current ones,
    //* so that the only visible thing is loading text.
    setUsers([]);
    setCurrentItems([]);

    const res = await UsersService.getAllUsers();
    const users = res.data.users;
    if (res.data.success) {
      setUsers(users);
      setAllUsers(users);
      setCurrentItems(users);
    }


    const paginatedUsers = paginate(users, usersPerPage);

    setUsers(paginatedUsers);
    setCurrentItems(getPage(paginatedUsers, page));

    setLoading(false);
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
          {loading && (
            <div css={PanelStyles.loading}>
              <span>Ładuję listę użytkowników...</span>
            </div>
          )}
          {!!users.length ? (
              <Items
                currentItems={currentItems}
                copyTitle={copyTitle}
                copied={copied}
                getUsers={getUsers}
                navigate={navigate}
                theme={theme}
              />
          ) : (
            !loading && (
              <div css={css`margin-left: 4px;`}>
                <Typography component='span' className='select-none opacity-80'>
                  Brak użytkowników w bazie
                </Typography>
              </div>
            )
          )}
        </div>
        <div css={PanelStyles.usersCount}>
          {users && (
            <span css={PanelStyles.userCountText}>
              Znaleziono {allUsers.length} użytkowników
            </span>
          )}
          {!!users.length && <div css={PanelStyles.pagination}>
            <Pagination
              css={css`display: flex; align-items: center`}
              shape='rounded'
              size={document.body.clientWidth <= 480 ? 'small' : 'medium'}
              siblingCount={document.body.clientWidth <= 480 ? 0 : 1}
              count={users.length}
              page={page}
              onChange={(e, p) => {
                setPage(p);
                changePage(p);
              }}
            />
          </div>}
          <Button
            variant='text'
            startIcon={<MdPersonAdd />}
            onClick={() => navigate('/dashboard/add-user')}
          >
            {document.body.clientWidth <= 480 ? 'Dodaj' : 'Dodaj użytkownika'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Panel;
