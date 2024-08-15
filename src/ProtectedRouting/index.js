import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRouting = () => {
  const navigate = useNavigate();
  const jwt = Cookies.get('jwt');

  useEffect(() => {
    if (!jwt) {
      navigate('/login');
    }
  }, [jwt, navigate]);

  return jwt ? <Outlet /> : null;
};

export default ProtectedRouting;
