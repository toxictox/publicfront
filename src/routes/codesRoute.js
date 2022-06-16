import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const CodesList = Loadable(lazy(() => import('@pages/codes/index')));
const CodesItemId = Loadable(lazy(() => import('@pages/codes/id')));
const CodesItemUpdate = Loadable(lazy(() => import('@pages/codes/update')));
const CodesItemСreate = Loadable(lazy(() => import('@pages/codes/create')));

export const codesRoute = {
  path: 'codes',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <CodesList />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <CodesItemСreate />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <CodesItemId />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/update',
      element: (
        <ACLGuard can={'update'}>
          <CodesItemUpdate />
        </ACLGuard>
      ),
    },
  ],
};
