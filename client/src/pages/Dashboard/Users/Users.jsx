import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import { Tooltip } from '@mui/material';
import { Pagination } from '@mui/material';
import UserItem from './UserItem';
import { useContext } from 'react';
import { ThemeContext } from '../../../App';
import { UsersStyles } from './users.styles';
import { css } from '@emotion/react';
import { useMemo } from 'react';
import { RefreshCw, UserPlus } from 'react-feather';
import { useWindowSize } from '../../../hooks/useWindowSize';

const usersPerPage = 10;

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { isMobile } = useWindowSize();


  const filteredUsers = useMemo(() =>
    allUsers.filter(
      (e) => {
        return e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.email?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          false ||
          e.phone_number?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          false ||
          `${e.name.toLowerCase()} ${e.surname.toLowerCase()}`.includes(searchQuery.toLowerCase()) ||
          `${e.surname.toLowerCase()} ${e.name.toLowerCase()}`.includes(searchQuery.toLowerCase())
      }), [allUsers, searchQuery]);



  const getUsersPerPage = async (page) => {
    setLoading(true);
    const res = await UsersService.getUsersPerPage({ skip: usersPerPage * (page - 1), take: usersPerPage });
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
    }
    getUsersPerPage(page);
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={UsersStyles.panel}>
      <div css={UsersStyles.container(theme)}>
        <p css={css`font-weight: 600`}>Lista użytkowników w bazie:</p>
        <div css={UsersStyles.searchBar}>
          <Tooltip title='Odśwież'>
            <span
              css={css`font-size: 20px; cursor: pointer;`}
              onClick={() => getUsers()}
            >
              <RefreshCw css={UsersStyles.loader(loading)} size={18} />
            </span>
          </Tooltip>
          <Input
            size='small'
            search={"true"}
            value={searchQuery}
            placeholder='Szukaj...'
            onChange={(e) => {
              if (e.target.value.length > 0) {
                setPage(1);
              }
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <div css={UsersStyles.users}>
          {!currentItems.length || loading ?
            <div css={UsersStyles.loadingText}>
              <span>{loading ? 'Ładuję listę użytkowników...' : 'Brak użytkowników'}</span>
            </div>
            :
            <div css={UsersStyles.users}>
              {(filteredUsers.length === allUsers.length ? currentItems :
                filteredUsers)
                .map((user) => (
                  <UserItem
                    user={user}
                    key={user.id}
                    getUsers={getUsers}
                    theme={theme}
                    setAllUsers={setAllUsers}
                  />
                ))}
            </div>
          }
        </div>
        <div css={UsersStyles.usersCount}>
          {currentItems && (
            <span css={UsersStyles.userCountText}>
              {isMobile ?
                `${allUsers.length} użytk.` :
                `Znaleziono ${allUsers.length} użytkowników`}
            </span>
          )}
          {!!currentItems.length && <div css={UsersStyles.pagination}>
            <Pagination
              css={css`display: flex; align-items: center`}
              shape='rounded'
              size={isMobile ? 'small' : 'medium'}
              siblingCount={isMobile ? 0 : 1}
              count={filteredUsers.length === allUsers.length ?
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
            startIcon={<UserPlus size={18} />}
            css={css`padding-inline: 16px;`}
            onClick={() => navigate('/dashboard/add-user')}
          >
            {isMobile ? 'Dodaj' : 'Dodaj użytkownika'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Users;
