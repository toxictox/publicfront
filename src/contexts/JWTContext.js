import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "@lib/axios";
import { app } from "@root/config";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        const accessId = window.localStorage.getItem("accessId");
        if (accessToken) {
          await axios.get(`${app.api}/user/${accessId}`).then((response) => {
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: true,
                user: {
                  ...response.data,
                  id: response.data.hash,
                  avatar:
                    "/static/mock-images/avatars/avatar-jane_rotanson.png",
                  name: `${response.data.firstName} ${response.data.lastName}`,
                  plan: "Premium",
                },
              },
            });
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    await axios
      .post(`${app.api}/login`, {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("accessId", response.data.user.hash); //response.data.token
        // dispatch({
        //   type: "LOGIN",
        //   payload: {
        //     user: {
        //       ...response.data.user,
        //       id: response.data.user.hash,
        //       avatar: "/static/mock-images/avatars/avatar-jane_rotanson.png",
        //       name: `${response.data.user.firstName} ${response.data.user.lastName}`,
        //       plan: "Premium",
        //     },
        //   },
        // });
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessId");
    dispatch({ type: "LOGOUT" });
  };

  const register = async (email, username, password, linkToken = null) => {
    console.log(email, username, password, linkToken);
    await axios
      .post(`${app.api}/registration`, {
        email,
        username,
        password,
        linkToken,
      })
      .then((response) => {
        // localStorage.setItem("accessToken", accessToken);

        // dispatch({
        //   type: "REGISTER",
        //   payload: {
        //     user,
        //   },
        // });
        toast.success(t("Success registration"));
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const passwordRecovery = async (email) => {
    await axios
      .post(`${app.api}/password/forget`, {
        email,
      })
      .then((response) => {
        // localStorage.setItem("accessToken", accessToken);

        // dispatch({
        //   type: "REGISTER",
        //   payload: {
        //     user,
        //   },
        // });
        toast.success(t("Success recovery send token"));
        navigate("/");
      })
      .catch((err) => {
        if (err.response !== undefined) {
          toast.error(t(err.response.data.message));
        } else {
          toast.error(`Ошибка отправки данных. Повторите позже`);
        }
      });
  };

  const passwordReset = async (email, password, token) => {
    await axios
      .post(`${app.api}/password/change/${token}`, {
        email,
        password,
      })
      .then((response) => {
        // localStorage.setItem("accessToken", accessToken);

        // dispatch({
        //   type: "REGISTER",
        //   payload: {
        //     user,
        //   },
        // });
        toast.success(t("Success recovery send token"));
        navigate("/");
      })
      .catch((err) => {
        toast.error(t(err.response.data.message));
      });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: "JWT",
        login,
        logout,
        register,
        passwordRecovery,
        passwordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
