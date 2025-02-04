import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const ManualGiveoutIndex = Loadable(lazy(() => import('@pages/manualGiveout/index')));

export const manualGiveoutRoute = {
  path: 'manual_giveout',
  children: [
    {
      path: '/list',
      element: (
          <ACLGuard type={'manualGiveout'} can={'view'}>
            <ManualGiveoutIndex />
          </ACLGuard>
      ),
    }
  ],
};
