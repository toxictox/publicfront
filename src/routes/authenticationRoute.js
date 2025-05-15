// Обновленный src/routes/authenticationRoute.js с GuestGuardWithTwoFactor
import { lazy } from 'react';
import Loadable from '@root/routes/Loadable';
import GuestGuard from '@root/components/GuestGuard';
import GuestGuardWithTwoFactor from '@root/components/GuestGuardWithTwoFactor';

const Login = Loadable(lazy(() => import('@pages/authentication/Login')));

const PasswordRecovery = Loadable(
    lazy(() => import('@pages/authentication/PasswordRecovery'))
);

const PasswordReset = Loadable(
    lazy(() => import('@pages/authentication/PasswordReset'))
);

const Register = Loadable(lazy(() => import('@pages/authentication/Register')));

const VerifyCode = Loadable(
    lazy(() => import('@pages/authentication/VerifyCode'))
);

const TwoFactorAuth = Loadable(
    lazy(() => import('@pages/authentication/TwoFactorAuth'))
);

export const authenticationRoute = {
  path: 'authentication',
  children: [
    {
      path: 'login',
      element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
      ),
    },
    {
      path: 'password/reset/:token',
      element: (
          <GuestGuard>
            <PasswordReset />
          </GuestGuard>
      ),
    },
    {
      path: 'password/reset',
      element: (
          <GuestGuard>
            <PasswordRecovery />
          </GuestGuard>
      ),
    },
    {
      path: 'register/:token',
      element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
      ),
    },
    {
      path: 'verify-code',
      element: (
          <GuestGuard>
            <VerifyCode />
          </GuestGuard>
      ),
    },
    {
      path: 'two-factor',
      element: (
          <GuestGuardWithTwoFactor>
            <TwoFactorAuth />
          </GuestGuardWithTwoFactor>
      ),
    },
  ],
};
