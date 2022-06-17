import { lazy } from 'react';
import DashboardLayout from '@root/components/dashboard/DashboardLayout';
import Loadable from '@root/routes/Loadable';
import AuthGuard from '@comp/AuthGuard';
import { Navigate } from 'react-router-dom';

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

const SocialFeed = Loadable(lazy(() => import('@pages/dashboard/SocialFeed')));
const SocialProfile = Loadable(
  lazy(() => import('@pages/dashboard/SocialProfile'))
);

export const dashboardRoute = {
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
