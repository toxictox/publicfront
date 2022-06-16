import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

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
  ],
};
