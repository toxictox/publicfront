import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const SanctionsListPage = Loadable(lazy(() => import('@pages/sanction/index')));

export const finMonRoute = {
  path: 'sanctions',
  children: [
    {
      path: '/',
      element: (
        <SanctionsListPage />
      ),
    },
  ],
};
