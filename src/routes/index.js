import AuthGuard from '@comp/AuthGuard';
import BaseLayout from '@comp/board/BaseLayout';
import GuestGuard from '@root/components/GuestGuard';
import GuestGuardWithTwoFactor from '@root/components/GuestGuardWithTwoFactor';
import Loadable from '@root/routes/Loadable';
import { authenticationRoute } from '@root/routes/authenticationRoute';
import { banksRoute } from '@root/routes/banksRoute';
import { binRoute } from '@root/routes/binRoute';
import { boardRoute } from '@root/routes/boardRoute';
import { cascadingRoute } from '@root/routes/cascadingRoute';
import { codesRoute } from '@root/routes/codesRoute';
import { error401Route } from '@root/routes/error401Route';
import { error404Route } from '@root/routes/error404Route';
import { error500Route } from '@root/routes/error500Route';
import { exportRoute } from '@root/routes/exportRoute';
import { flowsRoute } from '@root/routes/flowsRoute';
import { gatewaysRoute } from '@root/routes/gatewaysRoute';
import { merchantsRoute } from '@root/routes/merchantsRoute';
import { notFoundRoute } from '@root/routes/notFoundRoute';
import { reconciliationRoute } from '@root/routes/reconciliationRoute';
import { rolesRoute } from '@root/routes/rolesRoute';
import { terminalsRoute } from '@root/routes/terminalsRoute';
import { transactionsRoute } from '@root/routes/transactionsRoute';
import { usersRoute } from '@root/routes/usersRoute';
import { lazy } from 'react';
import { blog, dashboard, docs } from './developRoutes';
import { finMonRoute } from './finMonRoute';
import { maintenanceRoute } from './maintenanceRoute';
import { manualGiveoutRoute } from './manualGiveoutRoute';
import { transitAccountRoute } from './transitAccount';
import { companiesRoute } from './companiesRoute';
import { paymentPageDesignsRoute } from '@root/routes/paymentPageDesignsRoute';

const Login = Loadable(lazy(() => import('@pages/authentication/Login')));
const TwoFactorAuth = Loadable(lazy(() => import('@pages/authentication/TwoFactorAuth')));

const routes = [
  process.env.NODE_ENV === 'development' ? docs : {},
  process.env.NODE_ENV === 'development' ? dashboard : {},
  process.env.NODE_ENV === 'development' ? blog : {},

  authenticationRoute,
  {
    path: 'authentication/two-factor',
    element: (
        <GuestGuardWithTwoFactor>
          <TwoFactorAuth />
        </GuestGuardWithTwoFactor>
    )
  },
  {
    path: '*',
    element: (
        <AuthGuard>
          <BaseLayout />
        </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
        )
      },
      boardRoute,
      usersRoute,
      rolesRoute,
      codesRoute,
      banksRoute,
      flowsRoute,
      gatewaysRoute,
      terminalsRoute,
      cascadingRoute,
      merchantsRoute,
      binRoute,
      transactionsRoute,
      exportRoute,
      reconciliationRoute,
      error401Route,
      error404Route,
      error500Route,
      notFoundRoute,
      finMonRoute,
      manualGiveoutRoute,
      transitAccountRoute,
      maintenanceRoute,
      companiesRoute,
      paymentPageDesignsRoute
    ]
  }
];

export default routes;
