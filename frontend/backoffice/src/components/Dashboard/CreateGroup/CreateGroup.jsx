import { Container, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UsersService } from '../../../services/users.service';
import { GroupsService } from '../../../services/groups.service';
import { useNavigate } from 'react-router-dom';
import './CreateGroup.scss';
import Input from '../../Input/Input';
import { LoadingButton } from '@mui/lab';
import { TextField, Autocomplete, Tooltip } from '@mui/material';
import { MdErrorOutline, MdGroupAdd, MdAdd, MdDelete } from 'react-icons/md';
import { Component } from 'react';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState([]);
  const [error, setError] = useState('');
  const [types, setTypes] = useState([]);
  const [responseError, setResponseError] = useState('');

  const [users, setUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createGroup = async () => {
    if (!name) return setError('NAME');

    setError('');
    setLoading(true);

    let userIds = [];
    type.map((user) => {
      userIds.push(user.id);
    });

    const res = await GroupsService.createGroup({
      name,
      userIds,
    });

    if (res.data.success) navigate('/dashboard/groups');
    else setResponseError(res.data.message);

    setLoading(false);
  };

  useEffect(async () => {
    const res = await UsersService.getAllUsers();

    if (res.data.success) {
      setUsers(res.data.users);
      const _types = [];

      res.data.users.map((user) => {
        _types.push({ label: `${user.name} ${user.surname}`, id: user._id });
      });

      setTypes(_types);
    }
  }, []);

  return (
    <Container className='createGroup' maxWidth='sm'>
      <div className='createGroup_container drop-shadow-xl '>
        <div className='createGroup_box'>
          <div className='createGroup_box_names'>
            <Input
              autoFocus
              placeholder='Nazwa grupy'
              label='Nazwa'
              error={error.includes('NAME')}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
              fullWidth
            />
          </div>
          <div className='createGroup_box_select'>
            <Autocomplete
              disablePortal
              multiple
              options={types}
              value={type}
              onChange={(event, newValue) => {
                setType(newValue);
                setError('');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Dodaj u??ytkownik??w'
                  error={error.includes('TYPE')}
                />
              )}
              fullWidth
            />
          </div>
          <div className='createGroup_box_buttons'>
            <Button onClick={() => navigate('/dashboard/groups/')}>Wr????</Button>
            <LoadingButton
              variant='contained'
              loading={loading}
              loadingPosition='start'
              startIcon={<MdGroupAdd />}
              onClick={() => createGroup()}
            >
              {document.body.clientWidth <= 480 ? 'Utw??rz' : 'Utw??rz grup??'}
            </LoadingButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CreateGroup;
