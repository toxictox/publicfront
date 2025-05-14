import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const DesignsList = Loadable(lazy(() => import('@pages/paymentPageDesign/index')));

export const paymentPageDesignsRoute = {
  path: 'payment-page-designs',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard type={'merchants'} can={'create'}>
          <DesignsList />
        </ACLGuard>
      )
    }
  ],
};
