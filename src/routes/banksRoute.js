import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const BanksPage = Loadable(lazy(() => import('@pages/banks')));
const BanksPageIdPage = Loadable(lazy(() => import('@pages/banks/id')));
const BanksCreatePage = Loadable(lazy(() => import('@pages/banks/create')));
const BanksPageIdUpdatePage = Loadable(
  lazy(() => import('@pages/banks/update'))
);

export const banksRoute = {
  path: 'banks',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <BanksPage />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <BanksCreatePage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <BanksPageIdPage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/update',
      element: (
        <ACLGuard can={'update'}>
          <BanksPageIdUpdatePage />
        </ACLGuard>
      ),
    },
  ],
};
