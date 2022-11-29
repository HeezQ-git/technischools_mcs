import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LoginService } from '../services/login.service';

const CheckSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    (async () => {
      const res = await LoginService.checkSession();
      if (!res.data.success) navigate('/');
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default CheckSession;
