import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../../App';
import { AdminService } from '../../../services/admin.service';
import { useIsAdmin } from '../../../hooks/useIsAdmin';
import {AdminPanelStyles as styles} from './adminPanel.styles'
import AccountList from './AccountList';
import { Autocomplete, css, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Input from '../../../components/Input/Input';
import { LoadingButton } from '@mui/lab';
import { useForm } from '../../../hooks/useForm';
import { UserPlus } from 'react-feather';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  client: {id: null, name: null}
}

const AdminPanel = () => {
  const { values, handleChange, checkValidation, errors, setValues} = useForm(initialValues);

  const validationValues = {
    username: (value) => ({
      pattern: value.length > 0,
      message: 'Proszę wpisać nazwę użytkownika',
    }),
    email: (value) => ({
      pattern: value.length > 0,
      message: 'Proszę wpisać email',
    }),
    password: (value) => ({
      pattern: value.length > 0,
      message: 'Proszę wpisać hasło',
    }),
    confirmPassword: (value) => ({
      pattern: value === values.password && value.length > 0,
      message: 'Hasła nie są identyczne',
    })
  }
  
  const rootValidationValues = {
    ...validationValues,
    client: (value) => ({
      pattern: value.name !== null,
      message: 'Proszę wybrać klienta',
    })
  }

  const {theme} = useContext(ThemeContext);
  const { isRoot } = useIsAdmin();
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);

  const getAccounts = async () => {
    setLoadingAccounts(true);
    const res = await AdminService.getAllAccounts();
    setAccounts(res.data.accounts); 
    setLoadingAccounts(false);
  }

  const getClients = async () => {
    const res = await AdminService.getAllClients();
    setClients(res.data.clients);
  }

    
  const createAccount = async () => {
    const isValid = checkValidation(isRoot ? rootValidationValues : validationValues);
    if (!isValid) return;
    
    setLoading(true);

    await AdminService.createAccount(values);
    getAccounts();
    setValues(initialValues);
    setLoading(false);
  }

  useEffect(() => {
    getAccounts();
    getClients();
  }, [])


  return (
    <div css={styles.container}>
      <div css={styles.createAccount(theme)}>
        <div css={styles.createAccountHeader}>
          <h2 css={styles.title}>Utwórz konto</h2>
        </div>
        <div css={styles.form}>
          <div css={styles.rowGroup}>
            <Input
              placeholder='Nazwa użytkownika'
              label='Nazwa użytkownika'
              size='small'
              name='username'
              value={values.username}
              onChange={(e) => handleChange(e)}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
              required
            />
            <Input
              placeholder='Email'
              label='Email'
              size='small'
              name='email'
              value={values.email}
              onChange={(e) => handleChange(e)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
          </div>
          <div css={styles.rowGroup}>
            <Input
              placeholder='Hasło'
              label='Hasło'
              size='small'
              name='password'
              value={values.password}
              onChange={(e) => handleChange(e)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              required
              password={'true'}
              />
            <Input
              placeholder='Powtórz Hasło'
              label='Powtórz Hasło'
              size='small'
              name='confirmPassword'
              value={values.confirmPassword}
              onChange={(e) => handleChange(e)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              required
              password={'true'}
            />
          </div>
          {isRoot && 
          <Autocomplete
            options={clients}            
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => handleChange({target: {name: 'client', value: value}, persist: () => {}})}
            renderInput={(params) => (
              <Input
                {...params}
                label='Klient'
                size='small'
                error={!!errors.client}
                helperText={errors.client}
                required
              />
            )}
          />}
          <RadioGroup
            value={values.type}
            name='type'
            onChange={(e) => handleChange(e)}
            defaultValue='user'
            css={styles.rowGroup}
          >
            <FormControlLabel value='user' control={<Radio />} label='Zwykłe konto' />
            <FormControlLabel value='admin' control={<Radio />} label='Konto administratora' />
          </RadioGroup>

          <LoadingButton
            variant={document.body.clientWidth <= 480 ? 'text' : 'contained'}
            loading={loading}
            css={css`align-self: flex-end`}
            loadingPosition='start'
            startIcon={<UserPlus size={18} />}
            onClick={() => createAccount()}
          >
            Utwórz konto
          </LoadingButton>
        </div>
      </div>
      <AccountList accounts={accounts} clients={clients} loading={loadingAccounts} />
    </div>
  )
}

export default AdminPanel