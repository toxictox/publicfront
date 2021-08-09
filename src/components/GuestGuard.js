import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "@hooks/useAuth";

const GuestGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    console.log(window.location.pathname, "redirect");
    return <Navigate to="/board" />;
  }
  console.log(window.location.pathname, "quest");
  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
