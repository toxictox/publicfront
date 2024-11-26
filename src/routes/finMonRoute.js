import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';
import SanctionExclusionList from '@pages/sanction/_exclusion';

const SanctionsListPage = Loadable(lazy(() => import('@pages/sanction/index')));
const FinMonRuleIndex = Loadable(lazy(() => import('@pages/finMon/rules/index')));
const FinMonViolationIndex = Loadable(lazy(() => import('@pages/finMon/violation/index')));

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
        <ACLGuard type={'sanctionWhiteList'} can={'view'}>
          <SanctionExclusionList />
        </ACLGuard>
      ),
    },
    {
      path: '/rules',
      element: (
        <ACLGuard type={'finmonRules'} can={'view'}>
          <FinMonRuleIndex />
        </ACLGuard>
      ),
    },
    {
      path: '/violation',
      element: (
        <ACLGuard type={'finmonViolation'} can={'view'}>
          <FinMonViolationIndex />
        </ACLGuard>
      ),
    },
  ],
};
