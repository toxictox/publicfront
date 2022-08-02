import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const UsersPage = Loadable(lazy(() => import('@pages/users')));
const UsersPageInactive = Loadable(lazy(() => import('@pages/users/inactive')));
const UserItemIdPage = Loadable(lazy(() => import('@pages/users/id')));
const UserItemIdUpdatePage = Loadable(
  lazy(() => import('@pages/users/update'))
);

const UserRoleUpdatePage = Loadable(
  lazy(() => import('@pages/users/roles/update'))
);

const UserCreatePage = Loadable(lazy(() => import('@pages/users/create')));

export const usersRoute = {
  path: 'users',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <UsersPage />
        </ACLGuard>
      ),
    },
    {
      path: '/inactive',
      element: (
        <ACLGuard can={'read'}>
          <UsersPageInactive />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <UserCreatePage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <UserItemIdPage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/update',
      element: (
        <ACLGuard can={'update'}>
          <UserItemIdUpdatePage />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/role',
      element: (
        <ACLGuard can={'update'}>
          <UserRoleUpdatePage />
        </ACLGuard>
      ),
    },
  ],
};
