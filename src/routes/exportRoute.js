import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const ExportIndexPage = Loadable(lazy(() => import('@pages/export/index')));
const ExportCity24Docs = Loadable(
  lazy(() => import('@pages/export/ExportCity24Docs'))
);

export const exportRoute = {
  path: 'export',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <ExportIndexPage />
        </ACLGuard>
      )
    },
    {
      path: '/city24',
      element: (
        <ACLGuard can={'read'}>
          <ExportCity24Docs />
        </ACLGuard>
      )
    }
  ]
};
