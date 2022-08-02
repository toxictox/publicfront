import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '@root/routes/Loadable';
import DocsLayout from '@root/components/docs/DocsLayout';

const Docs = Loadable(lazy(() => import('@pages/Docs')));

export const docsRoute = {
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
