import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../services/store';
import { selectIsChecked, selectUserData } from '../services/slices/userSlice';

type ProtectedRouteProps = {
  isUnauthorize?: boolean;
};

export const ProtectedRoute = ({
  isUnauthorize = false
}: ProtectedRouteProps) => {
  const isChecked = useSelector(selectIsChecked);
  const user = useSelector(selectUserData);

  const location = useLocation();

  if (!isChecked) {
    return <Preloader />;
  }

  if (!isUnauthorize && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (isUnauthorize && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return <Outlet />;
};
