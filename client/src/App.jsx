import { Routes, Route } from 'react-router-dom';
import { useMemo, createContext, Suspense } from 'react';
import Login from './pages/Login/Login';
import Header from './components/Header/Header';
import Loader from './components/Loader/Loader';
import Dashboard from './pages/Dashboard/Dashboard';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { grey } from '@mui/material/colors';
import { Global } from '@emotion/react';
import emotionTailwindPreflight from 'emotion-tailwind-preflight';
import { AppStyles } from './App.styles';
import { useIsAdmin } from './hooks/useIsAdmin';
import { useTheme } from './hooks/useTheme';

export const ThemeContext = createContext();

const App = () => {
  const { isAdmin, refreshAdmin } = useIsAdmin();
  const [theme, toggleTheme] = useTheme();

  const muiTheme = useMemo(
    () => createTheme({
      palette: {
        mode: theme,
        text: {
          primary: theme === 'dark' ? grey[200] : grey[700],
          secondary: theme === 'dark' ? grey[300] : grey[800],
        },
        primary: {
          main: theme === 'dark' ? 'rgba(250,250,250,0.7)' : 'rgb(57,19,202) ',
          dark: theme === 'dark' ? 'rgba(250,250,250,0.4)' : 'rgb(43, 14, 160) ',
        },
      },
      components: {
        MuiButton: {
          root: {},
        },
      },
      shape: {
        borderRadius: 8,
      },
      typography: {
        button: {
          // textTransform: 'none'
        }
      }
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={theme ? { theme } : 'dark'}>
      <Global styles={AppStyles.global(theme, emotionTailwindPreflight)} />
      <div css={AppStyles.app(theme)}>
        <ThemeProvider theme={muiTheme}>
          <div css={AppStyles.container}>
            <Suspense fallback={
              <div>
                <Header theme={theme} changeTheme={toggleTheme} isAdmin={isAdmin} />
                <Loader />
              </div>
            }>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div css={AppStyles.centered}>
                      <Login theme={theme} refreshAdmin={refreshAdmin} />
                    </div>
                  }
                />
                <Route
                  path="/dashboard/*"
                  element={
                    <div>
                      <Header theme={theme} changeTheme={toggleTheme} isAdmin={isAdmin} />
                      <Dashboard />
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </ThemeProvider>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
