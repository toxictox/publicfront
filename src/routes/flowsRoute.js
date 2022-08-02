import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const TransactionFlowList = Loadable(lazy(() => import('@pages/flow')));
const TransactionFlowCreate = Loadable(
  lazy(() => import('@pages/flow/create'))
);
const TransactionFlowUpdate = Loadable(lazy(() => import('@pages/flow/id')));

export const flowsRoute = {
  path: 'flows',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <TransactionFlowList />
        </ACLGuard>
      ),
    },
    {
      path: '/create',
      element: (
        <ACLGuard can={'create'}>
          <TransactionFlowCreate />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'read'}>
          <TransactionFlowUpdate />
        </ACLGuard>
      ),
    },
  ],
};
