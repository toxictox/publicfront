import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const BinIndexPage = Loadable(lazy(() => import('@pages/bin/index')));

export const binRoute = {
  path: 'bin',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <BinIndexPage />
        </ACLGuard>
      ),
    },
  ],
};
