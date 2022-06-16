import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const CascadingModelList = Loadable(
  lazy(() => import('@pages/cascading/models'))
);
const CascadingModelId = Loadable(
  lazy(() => import('@pages/cascading/models/id'))
);

const CascadingCreate = Loadable(
  lazy(() => import('@pages/cascading/models/create'))
);

const GatewayIdPagePage = Loadable(lazy(() => import('@pages/gateway/update')));

export const cascadingRoute = {
  path: 'cascading',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <CascadingModelList />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <CascadingCreate />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <CascadingModelId />
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
  ],
};
