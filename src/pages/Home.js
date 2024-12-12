import useAuth from 'hooks/useAuth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home = () => {
  const { accountSetting } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!accountSetting || !accountSetting._id) {
      navigate('/settings/account');
    }
  }, [accountSetting]);

  console.log('accountSetting', accountSetting);

  return <div></div>;
};

export default Home;
