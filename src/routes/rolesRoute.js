import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const RolesList = Loadable(lazy(() => import('@pages/roles/index')));
const CreateRole = Loadable(lazy(() => import('@pages/roles/create')));
const UpdateRole = Loadable(lazy(() => import('@pages/roles/update')));

export const rolesRoute = {
  path: 'roles',
  children: [
    {
      element: (
        <ACLGuard can={'read'}>
          <RolesList />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <CreateRole />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <UpdateRole />
        </ACLGuard>
      ),
    },
  ],
};
