import axios from 'axios';

// Переменная для управления лоадером
let setLoading;

export const setLoaderHandler = (setLoaderFunction) => {
  console.log('Setting loader handler');
  setLoading = setLoaderFunction;
};

const token = localStorage.getItem("accessToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Интерсепторы для запросов
axios.interceptors.request.use(
  (config) => {
    if (setLoading) {
      console.log('Request started, showing loader');
      setLoading(true); // Показываем лоадер
    }
    return config;
  },
  (error) => {
    if (setLoading) {
      console.log('Request error, hiding loader');
      setLoading(false); // Скрываем лоадер при ошибке
    }
    return Promise.reject(error);
  }
);

// Интерсепторы для ответов
axios.interceptors.response.use(
  (response) => {
    if (setLoading) {
      console.log('Response received, hiding loader');
      setLoading(false); // Скрываем лоадер при успешном ответе
    }
    return response;
  },
  (error) => {
    if (setLoading) {
      console.log('Response error, hiding loader');
      setLoading(false); // Скрываем лоадер при ошибке
    }
    return Promise.reject(error);
  }
);

export default axios;
