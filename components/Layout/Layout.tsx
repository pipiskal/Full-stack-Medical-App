import React from 'react';

import AuthLayout from './AuthLayout/AuthLayout';
import LandingLayout from './LandingLayout/LandingLayout';

type LayoutTypeProps = {
  children?: React.ReactNode;
  type: 'auth' | 'dashboard' | 'home';
};

const AppLayout = React.lazy(
  () => import('@/components/Layout/AppLayout/AppLayout')
);

const layoutSelector = (
  children: React.ReactNode,
  type: 'auth' | 'dashboard' | 'home'
) => {
  const layouts = {
    auth: <AuthLayout>{children}</AuthLayout>,
    dashboard: <AppLayout />,
    home: <LandingLayout>{children}</LandingLayout>,
  };

  return layouts[type];
};

const Layout = ({ children, type }: LayoutTypeProps): JSX.Element => {
  return layoutSelector(children, type || 'home');
};

export default Layout;
