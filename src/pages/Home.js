import useAuth from 'hooks/useAuth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Home = () => {
  const { accountSetting } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(!accountSetting._id){
        navigate('/settings/account')
    }
  },[accountSetting._id])
  console.log('accountSetting', accountSetting);

  return <div></div>;
};

export default Home;
