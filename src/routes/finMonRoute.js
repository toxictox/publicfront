import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';
import SanctionExclusionList from '@pages/sanction/_exclusion';

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
    {
      path: '/exceptions',
      element: (
        <SanctionExclusionList />
      ),
    },
  ],
};
