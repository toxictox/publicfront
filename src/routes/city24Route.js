import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';

const City24TransactionsIndex = Loadable(
  lazy(() => import('@pages/city24/transactions/index'))
);
const City24TransactionsId = Loadable(
  lazy(() => import('@pages/city24/transactions/id'))
);

const City24MerchantsIndex = Loadable(
  lazy(() => import('@pages/city24/merchant'))
);
const City24MerchantId = Loadable(
  lazy(() => import('@pages/city24/merchant/id'))
);

const City24MerchantCreate = Loadable(
  lazy(() => import('@pages/city24/merchant/create'))
);

const City24TerminalsIndex = Loadable(
  lazy(() => import('@pages/city24/terminals'))
);

const City24TerminalId = Loadable(
  lazy(() => import('@pages/city24/terminals/id'))
);

const City24TerminalCreate = Loadable(
  lazy(() => import('@pages/city24/terminals/create'))
);

export const city24Route = {
  path: 'city24',
  children: [
    {
      path: 'transactions',
      children: [
        {
          path: '',
          element: <City24TransactionsIndex />,
        },
        {
          path: 'id/:id',
          element: <City24TransactionsId />,
        },
      ],
    },
    {
      path: 'merchants',
      children: [
        {
          path: '',
          element: <City24MerchantsIndex />,
        },
        {
          path: 'id/:id',
          element: <City24MerchantId />,
        },
        {
          path: 'create',
          element: <City24MerchantCreate />,
        },
      ],
    },
    {
      path: 'terminals',
      children: [
        {
          path: '',
          element: <City24TerminalsIndex />,
        },
        {
          path: 'id/:id',
          element: <City24TerminalId />,
        },
        {
          path: 'create',
          element: <City24TerminalCreate />,
        },
      ],
    },
    {
      path: 'keys',
      children: [
        {
          path: '',
          element: <City24TransactionsIndex />,
        },
      ],
    },
  ],
};
