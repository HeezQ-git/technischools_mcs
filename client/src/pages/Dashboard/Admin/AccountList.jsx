import { css } from '@emotion/react';
import { Autocomplete } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react'
import { User, Users, Cpu } from 'react-feather';
import { ThemeContext } from '../../../App';
import Input from '../../../components/Input/Input';
import { useIsAdmin } from '../../../hooks/useIsAdmin';
import { AccountListStyles } from './adminPanel.styles';

const AccountList = ({loading, accounts, clients }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [client, setClient] = useState('')

  const { isRoot } = useIsAdmin();
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      return (
        account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (isRoot && account.clients.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }, [accounts, searchQuery, isRoot]);

  const {theme} = useContext(ThemeContext);
  return (
    <div css={AccountListStyles.container(theme)}>
    <div css={AccountListStyles.search}>
            <h2 css={css`display: flex; align-items: center; gap: 8px;`}>
              <Users size={20} />
              {!isRoot && 'Wszystkie konta'}
            </h2>
            <Input
              size='small'
              search={"true"}
              placeholder='Szukaj...'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isRoot && <Autocomplete
              size='small'
              options={clients}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              renderInput={(params) => <Input {...params} label="Klient" />}
              onChange={(e, value) => setClient(value)}
            />
            }
          </div>
          <div css={AccountListStyles.list}>
            {!loading && !!accounts.length ? (
              filteredAccounts
              .filter((account) => account.clients?.name === client?.name || !client)
              .map((account) => {
              return (
                <div
                  key={account.id}
                >
                  <div css={AccountListStyles.accountItem}>
                    <div css={AccountListStyles.accountMain(theme)}>
                      <div css={AccountListStyles.accountTitle}>
                        {account.type === 'root' || account.type === 'admin' ? <Cpu size={17} /> : <User size={17} />}
                        {account.username}
                      </div>
                      <div css={AccountListStyles.itemInfo}>
                        <span>{account.email} </span>
                        {isRoot && <span>{account.clients.name}</span>}
                        </div>
                      
                    </div>
                  </div>
                </div>
              );
            })) : (
              <div css={AccountListStyles.loading}>
                {!loading ? 'Brak kont' : 'Ładowanie...'}
              </div>
            )}
              
          </div>
    </div>
  )
}

export default AccountList