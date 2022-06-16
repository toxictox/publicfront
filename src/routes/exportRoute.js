import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const ExportIndexPage = Loadable(lazy(() => import('@pages/export/index')));

export const exportRoute = {
  path: 'export',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <ExportIndexPage />
        </ACLGuard>
      ),
    },
  ],
};
