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

const ReconciliationSettings = Loadable(
  lazy(() => import('@pages/reconciliation/settings'))
);

const ReconciliationSettingsIndex = Loadable(
  lazy(() => import('@pages/reconciliation/settings/id'))
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
      path: 'settings',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationSettings />
        </ACLGuard>
      )
    },
    {
      path: 'settings/:id',
      element: (
        <ACLGuard can={'read'}>
          <ReconciliationSettingsIndex />
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
