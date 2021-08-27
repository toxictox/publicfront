const buttons = {
  "Recovery button": "Восстановить",
  "Change button": "Изменить",
  "Back button": "Назад",
  "Create button": "Создать",
  "Save button": "Сохранить",
  "Update button": "Обновить",
  "Delete button": "Удалить",
  "Search button": "Найти",
  "Clear button": "Очистить",
  "Copy button": "Скопировать",
  "Cancel button": "Отмена",
  "Ok button": "Ok",
  "Back to Home": "Вернуться на главную",
};

const menu = {
  "Transaction menu": "Транзакции",
  "Users menu": "Пользователи",
  "User Item": "Информация о пользователе",
  "Banks menu": "Банки",
  "Flow menu": "Схемы",
  "Gateway menu": "Шлюз",
  "Cascading menu": "Каскад",
  "Cascading rules menu": "Правила",
  "Cascading models menu": "Модели",
  "Terminals menu": "Терминалы",
};

const text = {
  "Having an account": "Уже есть аккаунт",
  "Reset account password": "Восстановить доступ",
  "Success update": "Запись обновлена",
  "Do you want to remove": "Хотите удалить запись?",
  "Register account": "Регистрация",
  "Success registration": "Вы успешно разрегестрированы",
  "Reset title": "Восстановление пароля",
  "Success recovery send token": "Инструкция по была отправлена на email",

  "Transactions List": "Список транзакций",
  "Transactions Item": "Информация о транзакции",

  "Users List": "Список пользователей",
  "User Item Update": "Обновление пользователя",

  "Terminals List": "Список терминалов",
  "Terminals Item Id": "Информация о терминале",
  "Terminals Model Create": "Создание нового терминала",
  "Terminals Token Update": "Обновление ключей",

  "Banks List": "Список банков",
  "Banks Item Id": "Информация о банке",
  "Bank Item Create": "Добавление нового банка",
  "Bank Item Update": "Обновление банка",
  "Bank Deposit Update": "Обновление лимита",

  "Transactions Flow List": "Список схем транзакций",
  "Transactions Flow Create": "Создание схемы транзакции",

  "Gateway List": "Список шлюзов",
  "Gateway Item Create": "Создание шлюза",
  "Gateway Item": "Описание шлюза",
  "Gateway Item Update": "Обновление шлюза",

  "Cascading Rules List": "Список правил",
  "Cascading Models List": "Список моделей",
  "Cascading Model Create": "Создание модели",
};

const fields = {
  uuid: "Id",
  name: "Название",
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
  "name bank field": "Название банка",
  depositLimit: "Лимит депозита",
  keyToken: "Ключи",
  flowName: "Название схемы",
  endpoint: "Точка входа",
  env: "Окружение",
  bank: "Банк",
  "name gateway field": "Название шлюза",
  "Select value": "Выбрать значение",
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
