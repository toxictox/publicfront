import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
const ServerError = Loadable(lazy(() => import('@pages/ServerError')));

export const error500Route = {
  path: '500',
  element: <ServerError />,
};
