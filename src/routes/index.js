import { lazy } from 'react';
import AuthGuard from '@comp/AuthGuard';
import GuestGuard from '@root/components/GuestGuard';
import Loadable from '@root/routes/Loadable';
import { authenticationRoute } from '@root/routes/authenticationRoute';
import { usersRoute } from '@root/routes/usersRoute';
import BaseLayout from '@comp/board/BaseLayout';
import { rolesRoute } from '@root/routes/rolesRoute';
import { codesRoute } from '@root/routes/codesRoute';
import { banksRoute } from '@root/routes/banksRoute';
import { flowsRoute } from '@root/routes/flowsRoute';
import { gatewaysRoute } from '@root/routes/gatewaysRoute';
import { terminalsRoute } from '@root/routes/terminalsRoute';
import { cascadingRoute } from '@root/routes/cascadingRoute';
import { merchantsRoute } from '@root/routes/merchantsRoute';
import { binRoute } from '@root/routes/binRoute';
import { transactionsRoute } from '@root/routes/transactionsRoute';
import { exportRoute } from '@root/routes/exportRoute';
import { reconciliationRoute } from '@root/routes/reconciliationRoute';
import { boardRoute } from '@root/routes/boardRoute';
import { error401Route } from '@root/routes/error401Route';
import { error404Route } from '@root/routes/error404Route';
import { error500Route } from '@root/routes/error500Route';
import { notFoundRoute } from '@root/routes/notFoundRoute';
import { dashboard, docs, blog } from './developRoutes';

const Login = Loadable(lazy(() => import('@pages/authentication/Login')));

const routes = [
  process.env.NODE_ENV === 'development' ? docs : {},
  process.env.NODE_ENV === 'development' ? dashboard : {},
  process.env.NODE_ENV === 'development' ? blog : {},

  authenticationRoute,
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
        ),
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
    ],
  },
];

export default routes;
