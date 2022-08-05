import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const TransactionIndexPage = Loadable(
  lazy(() => import('@pages/transactions'))
);

const TransactionItemIdPage = Loadable(
  lazy(() => import('@pages/transactions/id'))
);

const TransactionLogsPage = Loadable(
  lazy(() => import('@pages/transactions/id_logs'))
);

export const transactionsRoute = {
  path: 'transactions',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <TransactionIndexPage />
        </ACLGuard>
      ),
    },
    {
      path: ':id',
      element: (
        <ACLGuard can={'details'}>
          <TransactionItemIdPage />
        </ACLGuard>
      ),
    },
    {
      path: ':id/logs',
      element: (
        <ACLGuard can={'getTransactionLogs'}>
          <TransactionLogsPage />
        </ACLGuard>
      ),
    },
  ],
};
