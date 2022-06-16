import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';

const AuthorizationRequired = Loadable(
  lazy(() => import('@pages/AuthorizationRequired'))
);

export const error401Route = {
  path: '401',
  element: <AuthorizationRequired />,
};
