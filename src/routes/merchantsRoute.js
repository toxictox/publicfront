import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';
import AccountIndex from '@pages/merchant/_account';
import AccountId from '@pages/merchant/_account/id';
import AccountJobIndex from '@pages/merchant/_account/_job';
import AccountJobId from '@pages/merchant/_account/_job/id';

const MerchantList = Loadable(lazy(() => import('@pages/merchant/index')));
const MerchantModelId = Loadable(lazy(() => import('@pages/merchant/id')));
const MerchantModelIdUpdate = Loadable(
  lazy(() => import('@pages/merchant/update'))
);

const MerchantModelCreate = Loadable(
  lazy(() => import('@pages/merchant/create'))
);

const MerchantTokenUpdate = Loadable(
  lazy(() => import('@pages/merchant/_token/update'))
);

const MerchantDepositUpdate = Loadable(
  lazy(() => import('@pages/merchant/_deposit/update'))
);

const MerchantOverdraftIndex = Loadable(
  lazy(() => import('@pages/merchant/_overdraft/index'))
);

export const merchantsRoute = {
  path: 'merchants',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <MerchantList />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <MerchantModelCreate />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <MerchantModelId />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/update',
      element: (
        <ACLGuard can={'update'}>
          <MerchantModelIdUpdate />
        </ACLGuard>
      ),
    },

    {
      path: 'token/:id',
      element: (
        <ACLGuard can={'getMerchantKey'}>
          <MerchantTokenUpdate />
        </ACLGuard>
      ),
    },
    {
      path: 'deposit/:id',
      element: (
        <ACLGuard can={'depositLimitEdit'}>
          <MerchantDepositUpdate />
        </ACLGuard>
      ),
    },
    {
      path: ':id/overdraft',
      element: (
        <MerchantOverdraftIndex />
      ),
    },
    {
      path: ':id/account/',
      element: (
        <AccountIndex />
      ),
    },
    {
      path: ':merchantId/account/:accountId',
      element: (
        <AccountId />
      ),
    },
    {
      path: ':id/account_job/',
      element: (
        <AccountJobIndex />
      ),
    },
    {
      path: ':merchantId/account_job/:jobId',
      element: (
        <AccountJobId />
      ),
    },
  ],
};
