import { TextField, IconButton, InputAdornment, createTheme, ThemeProvider } from '@mui/material';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useContext, useState } from 'react';
import { ThemeContext } from '../../App';
import { grey } from '@mui/material/colors';

const Input = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const {theme} = useContext(ThemeContext);
  
  const muiTheme = createTheme({
    palette: {
      mode: theme ,
      text: {
        primary: theme === 'dark' ? grey[200] : grey[700],
          secondary: theme === 'dark' ? grey[300] : grey[800],
        },
        primary: {
          main: theme === 'dark' ? 'rgba(250,250,250,0.7)' : 'rgba(70,70,70,0.4)',
          dark: theme === 'dark' ? 'rgba(250,250,250,0.4)' : 'rgba(70,70,70,0.5)',
        },
      },
     shape: {
      borderRadius: 10,
    }, 
  });

  let inputProps = null;
  if (props.font) inputProps = { style: { fontSize: props.font } };

  if (props.password && !props.adornment)
    return (
      <ThemeProvider theme={muiTheme}>
        <TextField
          className='input-border'
          type={showPassword ? 'text' : 'password'}
          InputLabelProps={inputProps}
          InputProps={{
            ...inputProps,
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={handleClickShowPassword} edge='end'>
                  {showPassword ? (
                    <MdVisibilityOff size={22.5} />
                  ) : (
                    <MdVisibility size={22.5} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      </ThemeProvider>
    );
  else if (props.starticon)
    return (
      <ThemeProvider theme={muiTheme}>
        <TextField
          className='input-border'
          InputLabelProps={inputProps}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>{props.starticon}</InputAdornment>
            ),
          }}
          {...props}
        />
      </ThemeProvider>
    );
  else
    return (
      <ThemeProvider theme={muiTheme}>
        <TextField
          className='input-border'
          InputLabelProps={inputProps}
          InputProps={inputProps}
          {...props}
        />
      </ThemeProvider>
    );
};

export default Input;
