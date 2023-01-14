import { useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';

export const useIsAdmin = () => {
  const [authorization, setAuthorization] = useState(false);

  const checkAdmin = async () => {
    const res = await AuthService.checkSession();
    if (res.data.success) {
      if (res.data.user.accountType === 'admin') return { isAdmin: true, isRoot: false }
      else if (res.data.user.accountType === 'root') return { isAdmin: true, isRoot: true }
      else return false
    }
  }

  useEffect(() => {
    checkAdmin().then(res => setAuthorization(res));
  }
    , []);

  const refreshAdmin = () => {
    checkAdmin().then(res => setAuthorization(res));
  }

  return { ...authorization, refreshAdmin };
};