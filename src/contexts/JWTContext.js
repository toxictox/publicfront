// Исправленный JWTContext.js с предотвращением бесконечных редиректов
import axios from '@lib/axios';
import { app } from '@root/config';
import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  twoFactorRequired: false,
  twoFactorRegistrationRequired: false
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
    const { user, twoFactorRequired, twoFactorRegistrationRequired } = action.payload;

    return {
      ...state,
      isAuthenticated: !twoFactorRequired, // Аутентифицирован, только если не требуется 2FA
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

  // Добавляем флаг, чтобы избежать бесконечных редиректов
  let isNavigating = false;

  useEffect(() => {
    const initialize = async () => {
      if (window.location.pathname === '' || window.location.pathname === '/') {
        if (!isNavigating) {
          isNavigating = true;
          navigate('/board');
        }
        return;
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
                  avatar: '/static/mock-images/avatars/user.png',
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
        console.error(err);

        // Проверка на 2FA требование
        if (err.response && err.response.status === 401) {
          if (err.response.data &&
              err.response.data.error === 'access_denied' &&
              err.response.data.two_factor_complete === false) {

            if (!isNavigating && window.location.pathname !== '/authentication/two-factor') {
              isNavigating = true;
              navigate('/authentication/two-factor');
            }
            return;
          }
        }

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });

        if (!isNavigating) {
          isNavigating = true;
          navigate('/board');
        }
      }
    };

    initialize();
  }, [navigate]);

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

      // Проверяем статус двухфакторной аутентификации из ответа сервера
      const twoFactorRequired = response.data.result && response.data.result.two_factor_complete === false;
      const twoFactorRegistrationRequired = response.data.result && response.data.result.two_factor_registration_required === true;

      // Сохраняем токен и ID пользователя
      localStorage.setItem('accessToken', response.data.token);
      localStorage.setItem('accessId', response.data.user.hash);

      // Сохраняем ID мерчанта
      const merchantId = localStorage.getItem('merchId');
      merchantId
          ? localStorage.setItem('merchId', merchantId)
          : localStorage.setItem('merchId', response.data.user.merchantId);

      // Обновляем состояние авторизации
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...response.data.user,
            id: response.data.user.hash,
            avatar: '/static/mock-images/avatars/user.png',
            name: `${response.data.user.firstName} ${response.data.user.lastName}`,
            plan: 'Premium'
          },
          twoFactorRequired,
          twoFactorRegistrationRequired
        }
      });

      // Перенаправляем в зависимости от состояния 2FA
      if (twoFactorRequired || twoFactorRegistrationRequired) {
        if (!isNavigating) {
          isNavigating = true;
          navigate('/authentication/two-factor');
        }
      } else {
        if (!isNavigating) {
          isNavigating = true;
          navigate('/board');
        }
      }
    } catch (err) {
      console.error(err);

      // Проверка на 2FA ошибку
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

          if (!isNavigating) {
            isNavigating = true;
            navigate('/authentication/two-factor');
          }
          return;
        }
      }

      toast.error(err.response?.data?.message || t('Login failed'));
    }
  };

  const completeTwoFactor = () => {
    dispatch({
      type: 'TWO_FACTOR_COMPLETE'
    });
  };

  const logout = async () => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });

    if (!isNavigating) {
      isNavigating = true;
      setTimeout(() => {
        navigate('/board');
      }, 200);
    }
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

          if (!isNavigating) {
            isNavigating = true;
            navigate('/board');
          }
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

          if (!isNavigating) {
            isNavigating = true;
            navigate('/board');
          }
        })
        .catch((err) => {
          toast.error(t(err.response.data.message));
        });
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
