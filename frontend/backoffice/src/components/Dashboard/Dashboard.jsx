import React, { useState } from 'react';
import './Dashboard.scss';
import { Routes, Route } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Admin from './Admin/Admin';
import Panel from './Panel/Panel';
import Groups from './Groups/Groups';
import AddUser from './AddUser/AddUser';
import EditUser from './EditUser/EditUser';
import CreateGroup from './CreateGroup/CreateGroup';
import CheckSession from '../CheckSession';
import SendMessage from './SendMessage/SendMessage';
import Terminal from './Terminal/Terminal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [terminal, isTerminal] = useState(false);

  document.onkeydown = (e) => {
    if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'k'))
      e.preventDefault();
    if (e.ctrlKey && e.key === 'k') isTerminal(!terminal);
  };

  return (
    <div className='dashboard'>
      <Terminal opened={terminal} isTerminal={isTerminal} />
      <CheckSession />
      {(window.location.pathname == '/dashboard' ||
        window.location.pathname == '/dashboard/') && (
        <div className='dashboard_container sm:justify-center'>
          <div className='dashboard_container_box-wrap'>
            <div
              className='dashboard_container_box-wrap_box'
              onClick={() => navigate('/dashboard/panel')}
            >
              <h2>Panel</h2>
            </div>
          </div>
          <div className='dashboard_container_box-wrap'>
            <div
              className='dashboard_container_box-wrap_box '
              onClick={() => navigate('/dashboard/groups')}
            >
              <h2>Grupy</h2>
            </div>
          </div>
          <div className='dashboard_container_box-wrap'>
            <div
              className='dashboard_container_box-wrap_box '
              onClick={() => navigate('/dashboard/send-message')}
            >
              <h2>Wyślij wiadomość</h2>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path='/admin' element={<Admin />} />
        <Route path='/panel' element={<Panel />} />
        <Route path='/groups' element={<Groups />} />
        <Route path='/groups/:id' element={<Groups openGroup='true' />} />
        <Route path='/send-message' element={<SendMessage />} />
        <Route path='/add-user' element={<AddUser />} />
        <Route path='/edit-user/:id' element={<EditUser />} />
        <Route path='/create-group' element={<CreateGroup />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
