// src/lib/axios.js
import axios from 'axios';

// При инициализации axios не устанавливаем токен, сделаем это через перехватчик запросов
axios.interceptors.request.use(
    (config) => {
        // Получаем актуальный токен из localStorage для каждого запроса
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
            // Проверяем, является ли это ошибка необходимости 2FA
            if (error.response.data &&
                error.response.data.error === 'access_denied' &&
                error.response.data.two_factor_complete === false) {
                // Перенаправляем на 2FA страницу
                window.location.replace('/authentication/two-factor');
                return Promise.reject(error);
            }

            // Стандартное поведение для других 401 ошибок
            localStorage.removeItem('accessToken');
            localStorage.removeItem('accessId');
            window.location.replace('/');
        }
        return Promise.reject(error);
    }
);

export default axios;