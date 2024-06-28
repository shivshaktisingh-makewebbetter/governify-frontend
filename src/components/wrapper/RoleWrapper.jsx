import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRole } from '../../utils/helper';

const RoleWrapper = ({ children }) => {
  const navigate = useNavigate();
  const role = getRole();

  useEffect(() => {
    if(role === undefined  || role === null || role === ''){
      navigate('signin')
    }
    if (role  === 'superAdmin') {
      navigate('admin');
    }
  }, [role, navigate]);

  return <>{children}</>;
};

export default RoleWrapper;
