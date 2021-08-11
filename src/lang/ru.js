const buttons = {
  "Recovery button": "Восстановить",
  "Change button": "Изменить",
  "Back button": "Назад",
  "Create button": "Создать",
  "Update button": "Обновить",
  "Delete button": "Удалить",
  "Search button": "Найти",
  "Back to Home": "Вернуться на главную",
};

const menu = {
  "Transaction menu": "Транзакции",
  "Users menu": "Пользователи",
  "User Item": "Информация о пользователе",
};

const text = {
  "Having an account": "Уже есть аккаунт",
  "Reset account password": "Восстановить доступ",
  "Success update": "Запись обновлена",
  "Register account": "Регистрация",
  "Success registration": "Вы успешно разрегестрированы",
  "Reset title": "Восстановление пароля",
  "Success recovery send token": "Инструкция по была отправлена на email",
  "Transactions List": "Список транзакций",
  "Transactions Item": "Информация о транзакции",
  "Users List": "Список пользователей",
  "User Item Update": "Обновление пользователя",
};

const fields = {
  uuid: "Id",
  createOn: "Создано",
  merchant: "Мерчант",
  tranId: "Id транзакции",
  tranType: "Тип операции",
  pan: "Номер карты",
  amount: "Сумма",
  fee: "Комиссия",
  gateway: "Экваир",
  respCode: "Код ответа",
  lang: "Язык",
  editOn: "Обновлено",
  firstName: "Имя",
  lastName: "Фамилия",
  phone: "Телефон",
  loginTries: "Попыток авторизации",
  lastLogin: "Дата авторизации",
  linkToken: "Ключ",
  role: "Роль",
  "email table": "Email",
  "role name field": "Роль",
  "permissions field": "Разрешения",
};

const server = {
  "Token error": "Неверный ключ",
  "404 error title": "Страница не найдена",
  "404 error description":
    "Страница не найдена. Скорее всего она была удалено или перемещена :(",
};

const validationForm = {
  required: "Поле обязательно для заполнения",
  email: "Поле должно быть почтовым ящиком",
  "Passwords must match": "Пароли не совпадают",
};

export const ru = {
  "Welcome to React": "привет реакт",
  "Forgot password": "Забыли пароль?",
  "Create new account": "Создать аккаунт",
  "Login text": "Авторизация",
  ...buttons,
  ...fields,
  ...text,
  ...validationForm,
  ...menu,
  ...server,
};
