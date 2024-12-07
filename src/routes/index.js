import { useRoutes } from 'react-router-dom';

// project-imports
import LoginRoutes from './LoginRoutes';
// import CabProvidorRoutes from './CabProvidorRoutes';
import CabProvidorRoutes from './CabProviderRoutes1';

import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { USERTYPE } from 'constant';
import VendorRoutes from './VendorRoutes';

const PagesLanding = Loadable(lazy(() => import('pages/Landing')));
const PageNotFound = Loadable(lazy(() => import('pages/maintenance/error/404')));
// ==============================|| ROUTES RENDER ||============================== //

const ROUTES = {
  [USERTYPE.iscabProvider]: CabProvidorRoutes,
  [USERTYPE.isVendor]: VendorRoutes
};

export default function ThemeRoutes() {
  const userType = useSelector((state) => state.auth.userType);
  // console.log(`🚀 ~ ThemeRoutes ~ userType:`, userType);

  return useRoutes([
    {
      path: '/',
      element: <CommonLayout layout="landing" />,
      children: [
        {
          path: '/',
          element: <PagesLanding />
        }
      ]
    },
    LoginRoutes,
    // CabProvidorRoutes
    ROUTES[userType] ?? {
      path: '*',
      element: <PageNotFound />
    }
  ]);
}
