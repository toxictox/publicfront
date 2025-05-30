import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';
import ServerMaintenanceScheduleIndex from '@pages/gateway/_server_maintenance_schedule';
import ServerMaintenanceScheduleId from '@pages/gateway/_server_maintenance_schedule/id';

const GatewayIndexPage = Loadable(lazy(() => import('@pages/gateway')));
const GatewayCreatePage = Loadable(lazy(() => import('@pages/gateway/create')));
const GatewayIdPage = Loadable(lazy(() => import('@pages/gateway/id')));
const GatewayIdPagePage = Loadable(lazy(() => import('@pages/gateway/update')));

export const gatewaysRoute = {
  path: 'gateways',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <GatewayIndexPage />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <GatewayCreatePage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <GatewayIdPage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/update',
      element: (
        <ACLGuard can={'update'}>
          <GatewayIdPagePage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/server_maintenance_schedule/',
      element: (
        <ServerMaintenanceScheduleIndex />
      ),
    },
    {
      path: 'id/:id/server_maintenance_schedule/:scheduleId',
      element: (
        <ServerMaintenanceScheduleId />
      ),
    },
    // {
    //   path: "token/:id",
    //   element: <BanksDepositUpdatePage />,
    // },
  ],
};
