import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import ACLGuard from '@comp/ACLGuard';

const TerminalsList = Loadable(lazy(() => import('@pages/terminals')));
const TerminalsModelId = Loadable(lazy(() => import('@pages/terminals/id')));
const TerminalsCreate = Loadable(lazy(() => import('@pages/terminals/create')));

const TerminalsItemUpdate = Loadable(
  lazy(() => import('@pages/terminals/update'))
);

const TerminalsUpdateToken = Loadable(
  lazy(() => import('@pages/terminals/_token/update'))
);

export const terminalsRoute = {
  path: 'terminals',
  children: [
    {
      path: '/',
      element: (
        <ACLGuard can={'read'}>
          <TerminalsList />
        </ACLGuard>
      ),
    },
    {
      path: 'create',
      element: (
        <ACLGuard can={'create'}>
          <TerminalsCreate />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id',
      element: (
        <ACLGuard can={'details'}>
          <TerminalsModelId />
        </ACLGuard>
      ),
    },
    {
      path: 'id/:id/update',
      element: (
        <ACLGuard can={'update'}>
          <TerminalsItemUpdate />
        </ACLGuard>
      ),
    },
    {
      path: 'token/:id',
      element: (
        <ACLGuard can={'getTerminalKey'}>
          <TerminalsUpdateToken />
        </ACLGuard>
      ),
    },
  ],
};
