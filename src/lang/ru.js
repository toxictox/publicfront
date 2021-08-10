const buttons = {
  "Recovery button": "Восстановить",
  "Change button": "Изменить",
  "Back button": "Назад",
};

const menu = {
  "Transaction menu": "Транзакции",
};

const text = {
  "Having an account": "Уже есть аккаунт",
  "Reset account password": "Восстановить доступ",
  "Register account": "Регистрация",
  "Success registration": "Вы успешно разрегестрированы",
  "Reset title": "Восстановление пароля",
  "Success recovery send token": "Инструкция по была отправлена на email",
  "Transactions List": "Список транзакций",
  "Transactions Item": "Информация о транзакции",
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
};

const server = {
  "Token error": "Неверный ключ",
  "404 error title": "Страница не найдена",
  "404 error description": "Страница не найдена 222",
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
  ...text,
  ...validationForm,
  ...menu,
  ...server,
};
