import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (error.response.data &&
                error.response.data.error === 'access_denied' &&
                error.response.data.two_factor_complete === false) {
                window.location.replace('/authentication/two-factor');
                return Promise.reject(error);
            }

            localStorage.removeItem('accessToken');
            localStorage.removeItem('accessId');
            window.location.replace('/');
        }
        return Promise.reject(error);
    }
);

export default axios;
