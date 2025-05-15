import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import useAuth from "@hooks/useAuth";

const GuestGuardWithTwoFactor = (props) => {
    const { children } = props;
    const { isAuthenticated, twoFactorRequired } = useAuth();

    if (isAuthenticated && !twoFactorRequired) {
        return <Navigate to="/board" />;
    }

    return children;
};

GuestGuardWithTwoFactor.propTypes = {
    children: PropTypes.node
};

export default GuestGuardWithTwoFactor;
