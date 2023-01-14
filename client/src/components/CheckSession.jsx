import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthService } from '../services/auth.service';

const CheckSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    (async () => {
      const res = await AuthService.checkSession();
      if (!res.data.success) navigate('/');
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default CheckSession;
