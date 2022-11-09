import { Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { useNavigate } from 'react-router-dom';
import './Panel.scss';
import Input from '../../Input/Input';
import { Tooltip, IconButton } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatPhoneNumber, delay } from '../../../utils/functions';
import {
  MdDelete,
  MdEdit,
  MdMail,
  MdPersonAdd,
  MdPhone,
  MdRefresh,
} from 'react-icons/md';
import { CgSearch } from 'react-icons/cg';
import { HiMail } from 'react-icons/hi';
import { Pagination } from '@mui/material';
import { getPage, paginate } from '../../../utils/pagination';

const usersPerPage = 5;

const Panel = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentItems, setCurrentItems] = useState(null);
  const [page, setPage] = useState(1);
  const [copyTitle, setCopyTitle] = useState('Skopiuj');
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

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
          e.telephone?.toLowerCase()?.includes(data) ||
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
      setCurrentItems(users);
    }

    setAllUsers(users);

    const paginatedUsers = paginate(users, usersPerPage);

    setUsers(paginatedUsers);
    setCurrentItems(getPage(paginatedUsers, page));

    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='panel'>
      <div className='panel_container'>
        <p className='font-semibold'>Lista użytkowników w bazie:</p>
        <div className='panel_container_searchbar'>
          <Tooltip title='Odśwież'>
            <span
              style={{ fontSize: '20px', cursor: 'pointer' }}
              onClick={() => getUsers()}
            >
              <MdRefresh className={`${loading ? 'rotating' : ''}`} size={25} />
            </span>
          </Tooltip>
          <Input
            className='search_input'
            size='small'
            starticon={<CgSearch />}
            placeholder='Szukaj...'
            onChange={(e) => searchUser(e.target.value)}
          />
        </div>
        <div className='panel_users'>
          {loading && (
            <div className='panel_users_loading'>
              <span>Ładuję listę użytkowników...</span>
            </div>
          )}
          {!!users.length ? (
            <>
              <Items
                currentItems={currentItems}
                copyTitle={copyTitle}
                copied={copied}
                getUsers={getUsers}
                navigate={navigate}
              />
              <div className='pagination'>
                <Pagination
                  className='flex items-center'
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
              </div>
            </>
          ) : (
            !loading && (
              <div className='ml-[5px]'>
                <Typography component='span' className='select-none opacity-80'>
                  Brak użytkowników w bazie
                </Typography>
              </div>
            )
          )}
        </div>
        <div className='flex w-full items-center justify-between mt-[20px]'>
          {users && (
            <span className='opacity-30 select-none ml-[25px]'>
              Znaleziono {allUsers.length} użytkowników
            </span>
          )}
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

const Items = ({ currentItems, copyTitle, copied, getUsers, navigate }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState('Usuń');

  const deleteUser = async (user) => {
    if (confirmDelete) {
      setDeleteTitle('Usuwam...');

      const res = await UsersService.deleteUser({ id: user._id });

      if (res.data.success) {
        setDeleteTitle('Usunięto!');
        getUsers();
      }
    } else {
      setDeleteTitle('Kliknij, aby potwierdzić');
      setConfirmDelete(true);
    }
  };
  return (
    <div className='panel_users mb-[15px] '>
      {currentItems.map((user, index) => (
        <div key={index} className='panel_users_container'>
          <div className='panel_users_container_user hover:shadow-md'>
            <div className='panel_users_container_user_items pl-[10px]'>
              {user.name} {user.surname}
              {(user.email || user.telephone) && (
                <div className='onhover_info selection:bg-white-100 selection:text-indigo-900'>
                  {user.email && (
                    <p className='flex items-center gap-[6px]'>
                      <MdMail size={19} />

                      <CopyToClipboard
                        className='cursor-pointer'
                        onCopy={() => copied()}
                        text={user.email}
                      >
                        <Tooltip title={copyTitle}>
                          <span>
                            {user.email.split('@')[0]}
                            <wbr />@{user.email.split('@')[1]}
                          </span>
                        </Tooltip>
                      </CopyToClipboard>
                    </p>
                  )}
                  {user.telephone && (
                    <p className='flex items-center gap-[6px]'>
                      <MdPhone size={19} />
                      <CopyToClipboard
                        className='cursor-pointer'
                        onCopy={() => copied()}
                        text={user.telephone}
                      >
                        <Tooltip title={copyTitle}>
                          <span>
                            {user.telephone.startsWith('+48')
                              ? user.telephone
                              : `+48 ${formatPhoneNumber(user.telephone)}`}
                          </span>
                        </Tooltip>
                      </CopyToClipboard>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className='icons'>
              <Tooltip title='Edytuj'>
                <IconButton
                  size={'small'}
                  onClick={() => navigate(`/dashboard/edit-user/${user._id}`)}
                >
                  <span>
                    <MdEdit size={21} />
                  </span>
                </IconButton>
              </Tooltip>
              <Tooltip title={deleteTitle}>
                <IconButton
                  size={'small'}
                  onClick={() => deleteUser(user)}
                  onMouseLeave={() => {
                    setDeleteTitle('Usuń');
                    setConfirmDelete(false);
                  }}
                >
                  <span>
                    <MdDelete size={21} />
                  </span>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Panel;
