import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { themes } from '../constants/colors.styles';

export const useTheme = () => {
  // const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState('dark');
  const [cookies, setCookie] = useCookies(['theme']);

  useEffect(() => {
    if (cookies.theme != null) {
      setTheme(cookies.theme);
    }
  }, [cookies.theme]);

  // useEffect(() => {
  //   if (prefersDarkMode.matches) {
  //     setTheme('dark');
  //   } else {
  //     setTheme('light');
  //   }
  // }, [prefersDarkMode]);

  useEffect(() => {
    if (!cookies.theme) {
      setCookie('theme', theme, { path: '/' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    document.querySelector("meta[name='theme-color']").content = themes[theme].backgroundColor;
  }, [theme]);


  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setCookie('theme', newTheme, { path: '/', sameSite: 'strict' });
    document.querySelector("meta[name='theme-color']").content = themes[newTheme].backgroundColor;
    setTheme(newTheme);
  };
  console.log(theme);
  return [theme, toggleTheme];
}
