import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from '@lib/axios';
import { app } from '@root/config';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
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
  passwordReset: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      if (window.location.pathname === '' || window.location.pathname === '/') {
        navigate('/board');
      }
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const accessId = window.localStorage.getItem('accessId');
        if (accessToken) {
          await axios.get(`${app.api}/user/${accessId}`).then((response) => {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: {
                  ...response.data,
                  id: response.data.hash,
                  avatar:
                    '/static/mock-images/avatars/user.png',
                  name: `${response.data.firstName} ${response.data.lastName}`,
                  plan: 'Premium'
                }
              }
            });
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });

        navigate('/board');
      }
    };

    initialize();
  }, [navigate]);

  const login = async (email, password) => {
    await axios
      .post(`${app.api}/login_check`, {
        email: email,
        password: password
      }, {transformRequest: (data, headers) => {
        delete headers.common.Authorization;

        return JSON.stringify(data);
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('accessId', response.data.user.hash); //response.data.token
        localStorage.setItem('merchId', response.data.user.merchantId);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const logout = async () => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    setTimeout(() => navigate('/board'), 200);
    //window.location.reload();
  };

  const register = async (phone, password, linkToken = null) => {
    await axios
      .post(`${app.api}/registration`, {
        phone,
        password,
        inviteHash: linkToken
      })
      .then((response) => {
        toast.success(t('Success registration'));
        navigate('/board');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const passwordRecovery = async (email, cb) => {
    await axios
      .post(`${app.api}/password/forget`, {
        email
      })
      .then((response) => {
        cb(true);
      })
      .catch((err) => {
        if (err.response !== undefined) {
          toast.error(t(err.response.data.message));
        } else {
          toast.error(`Ошибка отправки данных. Повторите позже`);
        }
        cb(false);
      });
  };

  const passwordReset = async (email, password, token) => {
    await axios
      .post(`${app.api}/password/change/${token}`, {
        email,
        password
      })
      .then((response) => {
        toast.success(t('Password was successfully changed'));
        navigate('/board');
      })
      .catch((err) => {
        toast.error(t(err.response.data.message));
      });
  };

  const getAccess = (path, name) => {
    return (
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
        getAccess
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
