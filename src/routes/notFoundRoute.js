import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';

const NotFound = Loadable(lazy(() => import('@pages/NotFound')));

export const notFoundRoute = {
  path: '*',
  element: <NotFound />,
};
