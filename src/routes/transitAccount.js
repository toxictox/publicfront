import Loadable from '@root/routes/Loadable';
import { lazy } from 'react';

const HandbookCompanies = Loadable(
  lazy(() => import('@pages/transitAccount/companies/HandbookCompanies'))
);
const TransitTransactions = Loadable(
  lazy(() => import('@pages/transitAccount/TransitTransactions'))
);
const HandbookForm = Loadable(
  lazy(() => import('@pages/transitAccount/companies/HandbookCreateAndUpdate'))
);

export const transitAccountRoute = {
  path: 'transit-account',
  children: [
    {
      path: '/handbookCompanies',
      element: <HandbookCompanies />
    },
    {
      path: '/transitTransactions',
      element: <TransitTransactions />
    },
    {
      path: '/handbook/form',
      element: <HandbookForm />
    }
  ]
};
