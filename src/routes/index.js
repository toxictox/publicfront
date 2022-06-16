import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from '@comp/AuthGuard';
import BlogLayout from '@root/components/blog/BlogLayout';
import DashboardLayout from '@root/components/dashboard/DashboardLayout';
import DocsLayout from '@root/components/docs/DocsLayout';
import GuestGuard from '@root/components/GuestGuard';
import Loadable from '@root/routes/Loadable';
import { authenticationRoute } from '@root/routes/authenticationRoute';
import { usersRoute } from '@root/routes/usersRoute';
import BaseLayout from '@comp/board/BaseLayout';
import { rolesRoute } from '@root/routes/rolesRoute';
import { codesRoute } from '@root/routes/codesRoute';
import { city24Route } from '@root/routes/city24Route';
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

let dashboard = {},
  docs = {},
  blog = {};

// Browse pages
if (process.env.NODE_ENV === 'development') {
  // Blog pages

  const BlogPostCreate = Loadable(
    lazy(() => import('@pages/blog/BlogPostCreate'))
  );
  const BlogPostDetails = Loadable(
    lazy(() => import('@pages/blog/BlogPostDetails'))
  );
  const BlogPostList = Loadable(lazy(() => import('@pages/blog/BlogPostList')));

  // Dashboard pages

  const Account = Loadable(lazy(() => import('@pages/dashboard/Account')));
  const Analytics = Loadable(lazy(() => import('@pages/dashboard/Analytics')));
  const Calendar = Loadable(lazy(() => import('@pages/dashboard/Calendar')));
  const Chat = Loadable(lazy(() => import('@pages/dashboard/Chat')));
  const CustomerDetails = Loadable(
    lazy(() => import('@pages/dashboard/CustomerDetails'))
  );
  const CustomerEdit = Loadable(
    lazy(() => import('@pages/dashboard/CustomerEdit'))
  );
  const CustomerList = Loadable(
    lazy(() => import('@pages/dashboard/CustomerList'))
  );
  const Finance = Loadable(lazy(() => import('@pages/dashboard/Finance')));
  const InvoiceDetails = Loadable(
    lazy(() => import('@pages/dashboard/InvoiceDetails'))
  );
  const InvoiceList = Loadable(
    lazy(() => import('@pages/dashboard/InvoiceList'))
  );
  const Kanban = Loadable(lazy(() => import('@pages/dashboard/Kanban')));
  const Mail = Loadable(lazy(() => import('@pages/dashboard/Mail')));
  const OrderDetails = Loadable(
    lazy(() => import('@pages/dashboard/OrderDetails'))
  );
  const OrderList = Loadable(lazy(() => import('@pages/dashboard/OrderList')));
  const Overview = Loadable(lazy(() => import('@pages/dashboard/Overview')));
  const ProductCreate = Loadable(
    lazy(() => import('@pages/dashboard/ProductCreate'))
  );
  const ProductList = Loadable(
    lazy(() => import('@pages/dashboard/ProductList'))
  );

  // Docs pages

  const Docs = Loadable(lazy(() => import('@pages/Docs')));

  // Projects pages

  const ProjectBrowse = Loadable(
    lazy(() => import('@pages/dashboard/ProjectBrowse'))
  );
  const ProjectCreate = Loadable(
    lazy(() => import('@pages/dashboard/ProjectCreate'))
  );
  const ProjectDetails = Loadable(
    lazy(() => import('@pages/dashboard/ProjectDetails'))
  );

  // Social pages

  const SocialFeed = Loadable(
    lazy(() => import('@pages/dashboard/SocialFeed'))
  );
  const SocialProfile = Loadable(
    lazy(() => import('@pages/dashboard/SocialProfile'))
  );

  dashboard = {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Overview />,
      },
      {
        path: 'account',
        element: <Account />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'chat',
        children: [
          {
            path: '/',
            element: <Chat />,
          },
          {
            path: 'new',
            element: <Chat />,
          },
          {
            path: ':threadKey',
            element: <Chat />,
          },
        ],
      },
      {
        path: 'customers',
        children: [
          {
            path: '/',
            element: <CustomerList />,
          },
          {
            path: ':customerId',
            element: <CustomerDetails />,
          },
          {
            path: ':customerId/edit',
            element: <CustomerEdit />,
          },
        ],
      },
      {
        path: 'invoices',
        children: [
          {
            path: '/',
            element: <InvoiceList />,
          },
          {
            path: ':invoiceId',
            element: <InvoiceDetails />,
          },
        ],
      },
      {
        path: 'kanban',
        element: <Kanban />,
      },
      {
        path: 'mail',
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard/mail/all" replace />,
          },
          {
            path: 'label/:customLabel',
            element: <Mail />,
          },
          {
            path: 'label/:customLabel/:emailId',
            element: <Mail />,
          },
          {
            path: ':systemLabel',
            element: <Mail />,
          },
          {
            path: ':systemLabel/:emailId',
            element: <Mail />,
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '/',
            element: <OrderList />,
          },
          {
            path: ':orderId',
            element: <OrderDetails />,
          },
        ],
      },
      {
        path: 'finance',
        element: <Finance />,
      },
      {
        path: 'products',
        children: [
          {
            path: '/',
            element: <ProductList />,
          },
          {
            path: 'new',
            element: <ProductCreate />,
          },
        ],
      },
      {
        path: 'projects',
        children: [
          {
            path: 'browse',
            element: <ProjectBrowse />,
          },
          {
            path: 'new',
            element: <ProjectCreate />,
          },
          {
            path: ':projectId',
            element: <ProjectDetails />,
          },
        ],
      },
      {
        path: 'social',
        children: [
          {
            path: 'feed',
            element: <SocialFeed />,
          },
          {
            path: 'profile',
            element: <SocialProfile />,
          },
        ],
      },
    ],
  };

  blog = {
    path: 'blog',
    element: <BlogLayout />,
    children: [
      {
        path: '/',
        element: <BlogPostList />,
      },
      {
        path: 'new',
        element: <BlogPostCreate />,
      },
      {
        path: ':postId',
        element: <BlogPostDetails />,
      },
    ],
  };

  docs = {
    path: 'docs',
    element: <DocsLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/docs/overview/welcome" replace />,
      },
      {
        path: '*',
        element: <Docs />,
      },
    ],
  };
}

// Authentication pages

const Login = Loadable(lazy(() => import('@pages/authentication/Login')));

// Error pages

// New pages

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
      city24Route,
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
