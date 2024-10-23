import ACLGuard from '@comp/ACLGuard';
import Loadable from '@root/routes/Loadable';
import { lazy } from 'react';

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
          <ReconciliationPageOne pageNumber="two" />
        </ACLGuard>
      )
    },
    {
      path: 'results',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationPageOne pageNumber="one" />
        </ACLGuard>
      )
    },
    {
      path: 'results/:id',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationPageOne pageNumber="one" />
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
