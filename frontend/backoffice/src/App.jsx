/** @jsxImportSource @emotion/react */
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, useMemo, createContext } from 'react';
import { AppStyles } from './app.styles';
import Login from './pages/Login/Login';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { grey } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import { Global } from '@emotion/react'
import emotionTailwindPreflight from "emotion-tailwind-preflight";

export const ThemeContext = createContext();

const App = () => {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState('light');
  const [cookies, setCookie] = useCookies(['theme']);
  const changeTheme = () => {
    if (cookies.theme == null) {
      setCookie('theme', 'light', { path: '/' });
      return  setTheme(cookies.theme);
    }
    if ((theme != null || theme !== undefined) && theme === 'light') {
      setCookie('theme', 'dark', { path: '/' });
    } else {
      setCookie('theme', 'light', { path: '/' });
    }
    setTheme(cookies.theme);
  };
  
  const muiTheme = useMemo(
    () =>
    createTheme({
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
          borderRadius: 10,
        }, 
    }),
    [theme]
  );
      
  const themeValue = useMemo(() => ({ theme }), [theme]);
      
  useEffect(() => {
    if (cookies.theme == null)
    setCookie('theme', 'light', { path: '/' });
    setTheme(cookies.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersDarkMode]);  
  return (
    
    <ThemeContext.Provider value={themeValue}>
      <Global styles={AppStyles.global(theme, emotionTailwindPreflight)} />
      <div css={AppStyles.app(theme)}>
        <ThemeProvider theme={muiTheme}>
          <div css={AppStyles.container}>
            <Routes>
              <Route
                path='/'
                element={
                  <div css={AppStyles.centered}>
                    <Login theme={theme}/>
                  </div>
                }
              />
              <Route path='/dashboard/*' element={
                <div>  
                  <Header theme={theme} changeTheme={changeTheme}/>
                  <Dashboard />
                </div>
              } />
            </Routes>
          </div>
        </ThemeProvider>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
