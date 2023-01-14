import  { useContext, lazy } from 'react';
import { DashboardStyles } from './dashboard.styles';
import { Routes, Route } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../App';
import { useIsAdmin } from '../../hooks/useIsAdmin';

const Users = lazy(() => import('./Users/Users'));
const Groups = lazy(() => import('./Groups/Groups'));
const ManageUser = lazy(() => import('./ManageUser/ManageUser'));
const CreateGroup = lazy(() => import('./CreateGroup/CreateGroup'));
const CheckSession = lazy(() => import('../../components/CheckSession'));
const SendMessage = lazy(() => import('./Messages/SendMessage'));
const AdminPanel = lazy(() => import('./Admin/AdminPanel'));

const Dashboard = () => {
  const navigate = useNavigate();
  const {theme} = useContext(ThemeContext);
  const isAdmin = useIsAdmin();

  // const [terminal, isTerminal] = useState(false);
  // document.onkeydown = (e) => {
  //   if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'k'))
  //     e.preventDefault();
  //   if (e.ctrlKey && e.key === 'k') isTerminal(!terminal);
  //   else if (e.key === 'Escape') isTerminal(false);
  // };

  // useEffect(() => {
  //   document.body.style.overflow = terminal ? 'hidden' : 'unset';
  // }, [terminal]);



  return (
    <div css={DashboardStyles.dashboard}>
      {/* <Terminal opened={terminal} isTerminal={isTerminal} /> */}
      <CheckSession />
      {(window.location.pathname === '/dashboard' ||
        window.location.pathname === '/dashboard/') && (
        <div css={DashboardStyles.container}>
          <div css={DashboardStyles.boxWrap}>
            <div
              css={DashboardStyles.box(theme)}
              onClick={() => navigate('/dashboard/users')}
            >
              <h2>Użytkownicy</h2>
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
          <Route path='/users' element={<Users />} />
          <Route path='/groups' element={<Groups />} />
          <Route path='/groups/:id' element={<Groups />} />
          <Route path='/messages' element={<SendMessage />} />
          <Route path='/add-user' element={<ManageUser />} />
          <Route path='/edit-user/:id' element={<ManageUser />} />
          <Route path='/create-group' element={<CreateGroup />} />
          {isAdmin && <Route path='/admin' element={<AdminPanel />} />}
        </Routes>
    </div>
  );
};

export default Dashboard;
