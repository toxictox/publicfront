import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';
import SanctionExclusionList from '@pages/sanction/_exclusion';

const SanctionsListPage = Loadable(lazy(() => import('@pages/sanction/index')));
const FinMonRuleIndex = Loadable(lazy(() => import('@pages/finMon/rules/index')));

export const finMonRoute = {
  path: 'fin_mon',
  children: [
    {
      path: '/sanctions',
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
    {
      path: '/rules',
      element: (
        <FinMonRuleIndex />
      ),
    },
  ],
};
