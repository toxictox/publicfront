import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';

const HomeNew = Loadable(lazy(() => import('@pages/home/Home')));

export const boardRoute = {
  path: 'board',
  element: <HomeNew />,
};
