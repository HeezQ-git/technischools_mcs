/** @jsxImportSource @emotion/react */
import  { useContext, useState } from 'react';
import { DashboardStyles } from './dashboard.styles';
import { Routes, Route } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Panel from './Panel/Panel';
import Groups from './Groups/Groups';
import ManageUser from './ManageUser/ManageUser';
import CreateGroup from './CreateGroup/CreateGroup';
import CheckSession from '../../components/CheckSession';
import SendMessage from './Messages/SendMessage';
import Terminal from './Terminal/Terminal';
import { useEffect } from 'react';
import { ThemeContext } from '../../App';

const Dashboard = () => {
  const navigate = useNavigate();
  const [terminal, isTerminal] = useState(false);

  const {theme} = useContext(ThemeContext);

  document.onkeydown = (e) => {
    if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'k'))
      e.preventDefault();
    if (e.ctrlKey && e.key === 'k') isTerminal(!terminal);
    else if (e.key === 'Escape') isTerminal(false);
  };

  useEffect(() => {
    document.body.style.overflow = terminal ? 'hidden' : 'unset';
  }, [terminal]);

  return (
    <div css={DashboardStyles.dashboard}>
      <Terminal opened={terminal} isTerminal={isTerminal} />
      <CheckSession />
      {(window.location.pathname === '/dashboard' ||
        window.location.pathname === '/dashboard/') && (
        <div css={DashboardStyles.container}>
          <div css={DashboardStyles.boxWrap}>
            <div
              css={DashboardStyles.box(theme)}
              onClick={() => navigate('/dashboard/panel')}
            >
              <h2>Panel</h2>
            </div>
          </div>
          <div css={DashboardStyles.boxWrap}>
            <div
              css={DashboardStyles.box(theme)}
              onClick={() => navigate('/dashboard/groups')}
            >
              <h2>Grupy</h2>
            </div>
          </div>
          <div css={DashboardStyles.boxWrap}>
            <div
              css={DashboardStyles.box(theme)}
              onClick={() => navigate('/dashboard/messages')}
            >
              <h2>Wyślij wiadomość</h2>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path='/panel' element={<Panel />} />
        <Route path='/groups' element={<Groups />} />
        <Route path='/groups/:id' element={<Groups />} />
        <Route path='/messages' element={<SendMessage />} />
        <Route path='/add-user' element={<ManageUser />} />
        <Route path='/edit-user/:id' element={<ManageUser />} />
        <Route path='/create-group' element={<CreateGroup />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
