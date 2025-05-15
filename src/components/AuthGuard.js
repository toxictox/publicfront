// src/components/AuthGuard.js
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "@hooks/useAuth";
import Login from "@pages/authentication/Login";

const AuthGuard = (props) => {
  const { children } = props;
  const auth = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Устанавливаем флаг, чтобы избежать бесконечных редиректов
    if (!initialCheckDone) {
      setInitialCheckDone(true);
    }
  }, [initialCheckDone]);

  // Если аутентификация еще не инициализирована, показываем пустой компонент
  if (!auth.isInitialized) {
    return null;
  }

  if (!auth.isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }

    // Если требуется 2FA, перенаправляем на страницу 2FA вместо входа
    if (auth.twoFactorRequired || auth.twoFactorRegistrationRequired) {
      // Избегаем бесконечных редиректов
      if (location.pathname !== '/authentication/two-factor') {
        return <Navigate to="/authentication/two-factor" />;
      }
      // Если уже на странице 2FA, просто продолжаем
      return children;
    }

    return <Login />;
  }

  // Избегаем бесконечных редиректов, если страница перезагружается на /board
  if (location.pathname === '/board' && initialCheckDone) {
    return children;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
