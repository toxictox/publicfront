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
    if (!initialCheckDone) {
      setInitialCheckDone(true);
    }
  }, [initialCheckDone]);

  if (!auth.isInitialized) {
    return null;
  }

  if (!auth.isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }

    if (auth.twoFactorRequired || auth.twoFactorRegistrationRequired) {
      if (location.pathname !== '/authentication/two-factor') {
        return <Navigate to="/authentication/two-factor" />;
      }

      return children;
    }

    return <Login />;
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
