import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const ReconciliationList = Loadable(
  lazy(() => import('@pages/reconciliation/index'))
);

export const reconciliationRoute = {
  path: 'reconciliation',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationList />
        </ACLGuard>
      ),
    },
  ],
};
