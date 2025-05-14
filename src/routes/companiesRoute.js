import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const CompaniesList = Loadable(lazy(() => import('@pages/company/index')));

export const companiesRoute = {
  path: 'companies',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard type={'merchants'} can={'create'}>
          <CompaniesList />
        </ACLGuard>
      )
    }
  ],
};
