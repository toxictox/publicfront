import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const ReconciliationList = Loadable(
  lazy(() => import('@pages/reconciliation/index'))
);
const ReconciliationPageOne = Loadable(
  lazy(() => import('@pages/reconciliation/reconciliationPage1'))
);

const ReconciliationDetail = Loadable(
  lazy(() => import('@pages/reconciliation/ReconcilationDetail'))
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
      )
    },
    {
      path: 'results',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationPageOne />
        </ACLGuard>
      )
    },
    {
      path: '/:id',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationDetail />
        </ACLGuard>
      )
    }
  ]
};
