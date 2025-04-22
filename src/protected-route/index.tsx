import React from 'react';

type ProtectedRouteProps = {
  children: React.ReactElement;
  isProtected?: boolean;
};

export const ProtectedRoute = ({
  children,
  isProtected = false
}: ProtectedRouteProps) => children;
