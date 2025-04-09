import Loadable from '@root/routes/Loadable';
import { lazy } from 'react';

const MainteIndex = Loadable(lazy(() => import('@pages/maintenance/index')));
const CreateMaintenance = Loadable(
  lazy(() => import('@pages/maintenance/createAndUpdate'))
);

export const maintenanceRoute = {
  path: 'maintenance',
  children: [
    {
      path: '/',
      element: <MainteIndex />
    },
    {
      path: '/create',
      element: <CreateMaintenance />
    }
  ]
};
