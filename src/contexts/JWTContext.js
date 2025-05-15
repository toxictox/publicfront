import axios from '@lib/axios';
import { app } from '@root/config';
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  twoFactorRequired: false,
  twoFactorRegistrationRequired: false
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, twoFactorRequired, twoFactorRegistrationRequired } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      twoFactorRequired,
      twoFactorRegistrationRequired
    };
  },
  LOGIN: (state, action) => {
    const { user, twoFactorRequired, twoFactorRegistrationRequired } = action.payload;

    return {
      ...state,
      isAuthenticated: !twoFactorRequired,
      user,
      twoFactorRequired,
      twoFactorRegistrationRequired
    };
  },
  TWO_FACTOR_COMPLETE: (state) => ({
    ...state,
    isAuthenticated: true,
    twoFactorRequired: false,
    twoFactorRegistrationRequired: false
  }),
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
  completeTwoFactor: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  let isNavigating = false;

  useEffect(() => {
    const initialize = async () => {
      const isTwoFactorPage = location.pathname === '/authentication/two-factor';
      const accessToken = window.localStorage.getItem('accessToken');
      const accessId = window.localStorage.getItem('accessId');

      const savedTwoFactorRequired = localStorage.getItem('twoFactorRequired') === 'true';
      const savedTwoFactorRegistrationRequired = localStorage.getItem('twoFactorRegistrationRequired') === 'true';

      if (!accessToken || !accessId) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            twoFactorRequired: false,
            twoFactorRegistrationRequired: false
          }
        });

        if (isTwoFactorPage && !isNavigating) {
          isNavigating = true;
          navigate('/authentication/login');
        }
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      if (isTwoFactorPage) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            twoFactorRequired: savedTwoFactorRequired,
            twoFactorRegistrationRequired: savedTwoFactorRegistrationRequired  // Используем сохраненный флаг
          }
        });
        return;
      }

      try {
        const response = await axios.get(`${app.api}/user/${accessId}`);

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: {
              ...response.data,
              id: response.data.hash,
              avatar: '/static/mock-images/avatars/user.png',
              name: `${response.data.firstName} ${response.data.lastName}`,
              plan: 'Premium'
            },
            twoFactorRequired: false,
            twoFactorRegistrationRequired: false
          }
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          if (err.response.data &&
              err.response.data.error === 'access_denied' &&
              err.response.data.two_factor_complete === false) {

            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null,
                twoFactorRequired: true,
                twoFactorRegistrationRequired: false
              }
            });

            if (!isTwoFactorPage && !isNavigating) {
              isNavigating = true;
              navigate('/authentication/two-factor');
            }
            return;
          }
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessId');
        localStorage.removeItem('twoFactorRequired');
        localStorage.removeItem('twoFactorRegistrationRequired');

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            twoFactorRequired: false,
            twoFactorRegistrationRequired: false
          }
        });

        if (!isNavigating) {
          isNavigating = true;
          navigate('/authentication/login');
        }
      }
    };

    initialize();
  }, [location.pathname, navigate]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
          `${app.api}/login_check`,
          {
            email: email,
            password: password
          },
          {
            transformRequest: (data, headers) => {
              delete headers.common.Authorization;
              return JSON.stringify(data);
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      const token = response.data.token;
      const user = response.data.user;

      const twoFactorRequired = response.data.result && response.data.result.two_factor_complete === false;
      const twoFactorRegistrationRequired = response.data.result && response.data.result.two_factor_registration_required === true;

      localStorage.setItem('twoFactorRequired', twoFactorRequired ? 'true' : 'false');
      localStorage.setItem('twoFactorRegistrationRequired', twoFactorRegistrationRequired ? 'true' : 'false');

      localStorage.setItem('accessToken', token);
      localStorage.setItem('accessId', user.hash);

      const merchantId = localStorage.getItem('merchId');
      merchantId
          ? localStorage.setItem('merchId', merchantId)
          : localStorage.setItem('merchId', user.merchantId);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            id: user.hash,
            avatar: '/static/mock-images/avatars/user.png',
            name: `${user.firstName} ${user.lastName}`,
            plan: 'Premium'
          },
          twoFactorRequired,
          twoFactorRegistrationRequired
        }
      });

      if (twoFactorRequired || twoFactorRegistrationRequired) {
        navigate('/authentication/two-factor');
      } else {
        navigate('/board');
      }

      return { success: true };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        if (err.response.data &&
            err.response.data.error === 'access_denied' &&
            err.response.data.two_factor_complete === false) {

          dispatch({
            type: 'LOGIN',
            payload: {
              user: null,
              twoFactorRequired: true,
              twoFactorRegistrationRequired: false
            }
          });

          navigate('/authentication/two-factor');
          return { success: false };
        }
      }

      toast.error(err.response?.data?.message || t('Login failed'));
      return { success: false };
    }
  };

  const completeTwoFactor = () => {
    localStorage.setItem('twoFactorRequired', 'false');
    localStorage.setItem('twoFactorRegistrationRequired', 'false');

    dispatch({
      type: 'TWO_FACTOR_COMPLETE'
    });
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessId');
    localStorage.removeItem('merchId');
    localStorage.removeItem('twoFactorRequired');
    localStorage.removeItem('twoFactorRegistrationRequired');

    delete axios.defaults.headers.common.Authorization;

    dispatch({ type: 'LOGOUT' });
    navigate('/authentication/login');
  };

  const register = async (phone, password, linkToken = null) => {
    try {
      await axios.post(`${app.api}/registration`, {
        phone,
        password,
        inviteHash: linkToken
      });

      toast.success(t('Success registration'));
      navigate('/authentication/login');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || t('Registration failed'));
      return { success: false };
    }
  };

  const passwordRecovery = async (email, cb) => {
    try {
      await axios.post(`${app.api}/password/forget`, { email });
      if (cb) cb(true);
      return { success: true };
    } catch (err) {
      if (err.response !== undefined) {
        toast.error(t(err.response.data.message));
      } else {
        toast.error(`Ошибка отправки данных. Повторите позже`);
      }
      if (cb) cb(false);
      return { success: false };
    }
  };

  const passwordReset = async (email, password, token) => {
    try {
      await axios.post(`${app.api}/password/change/${token}`, {
        email,
        password
      });

      toast.success(t('Password was successfully changed'));
      navigate('/authentication/login');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || t('Password reset failed'));
      return { success: false };
    }
  };

  const getAccess = (path, name) => {
    return (
        state.user &&
        state.user.permissions &&
        state.user.permissions[path] !== undefined &&
        state.user.permissions[path].includes(name)
    );
  };

  return (
      <AuthContext.Provider
          value={{
            ...state,
            platform: 'JWT',
            login,
            logout,
            register,
            passwordRecovery,
            passwordReset,
            getAccess,
            completeTwoFactor
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
