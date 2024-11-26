import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "@hooks/useAuth";
import ForbiddenRequest from "@pages/ForbiddenRequest";

const ACLGuard = ({children, type = undefined, can}) => {
  const auth = useAuth();
  const location = useLocation();
  const path = type ? type : location.pathname.split("/").filter((item) => item !== "")[0];

  if (auth.user.permissions[path] === undefined) {
    return <ForbiddenRequest />;
  }

  if (auth.user.permissions[path].indexOf(can) === -1) {
    return <ForbiddenRequest />;
  }

  return <>{children}</>;
};

ACLGuard.propTypes = {
  children: PropTypes.node,
};

export default ACLGuard;
