import axios from '@lib/axios';
import { app } from '@root/config';
import { getCsvFileHelper2 } from '@utils/getCsvFileHelper';
import * as Yup from 'yup';

export const initialValues = {
  resolved: null,
  bankId: [],
  startDate: null,
  endDate: null,
  merchants: [],
  statuses: [],
  jobs: []
};

export const validationSchema = Yup.object({
  bankId: Yup.string(),
  dateFrom: Yup.date().nullable(),
  dateTo: Yup.date().nullable(),
  fileStatus: Yup.string(),
  transactionStatus: Yup.array().of(Yup.string()),
  hideFields: Yup.string().oneOf(
    ['enable', 'disable'],
    'Выберите один из вариантов'
  )
});

export const fileStatusOptions = [
  { value: 'created', label: 'Создан' },
  { value: 'uploaded', label: 'Загружен файл' },
  { value: 'in_process', label: 'В процессе' },
  { value: 'validation_error', label: 'Ошибка валидации' },
  { value: 'processed', label: 'Обработан' }
];

export const transactionStatusOptions = [
  { value: 'verified', label: 'Проверено' },
  { value: 'no_data', label: 'Нет данных' },
  { value: 'invalid_id', label: 'Некорректный ИД' },
  { value: 'invalid_amount', label: 'Некорректная сумма' },
  { value: 'invalid_commission', label: 'Некорректная комиссия' },
  { value: 'invalid_datetime', label: 'Некорректная дата/время' },
  { value: 'invalid_inn', label: 'Некорректный ИНН' },
  { value: 'duplicate', label: 'Дубликат' }
];

export const hideFieldsOptions = [
  { value: 'enable', label: 'Включить' },
  { value: 'disable', label: 'Выключить' }
];

export const fetchReconciliationData = async () => {
  try {
    const response = await axios.get(`${app.api}/reconciliation`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reconciliation data:', error);
  }
};

export const getFile = async (
  resolved,
  startDate,
  endDate,
  merchants,
  banks,
  statuses,
  jobs
) => {
  const merchantParams = merchants.length
    ? merchants.map((merchant) => `merchants[]=${merchant}`).join('&')
    : '';
  const bankParams = banks.length
    ? banks.map((bank) => `banks[]=${bank}`).join('&')
    : '';
  const typesParams = jobs.length
    ? jobs.map((job) => `jobs[]=${job}`).join('&')
    : '';
  const statusParams = statuses.length
    ? statuses.map((status) => `statuses[]=${status}`).join('&')
    : '';

  const params = [
    resolved !== undefined && resolved !== null ? `resolved=${resolved}` : '',
    startDate ? `startDate=${startDate}` : '',
    endDate ? `endDate=${endDate}` : '',
    merchantParams,
    bankParams,
    statusParams,
    typesParams
  ]
    .filter(Boolean)
    .join('&');

  const response = await axios
    .get(`${app.api}/reconciliation/results/report?${params}`)
    .then((res) => {
      const { data, headers } = res;
      getCsvFileHelper2({ data, headers });
    });
};

export const getResults = async (
  page,
  count,
  resolved,
  startDate,
  endDate,
  merchants,
  banks,
  statuses,
  jobs,
  pageNumber
) => {
  const url = pageNumber ==='one' ? 'reconciliation/results' : 'reconciliation'

  const merchantParams = merchants.length
    ? merchants.map((merchant) => `merchants[]=${merchant}`).join('&')
    : '';
  const bankParams = banks.length
    ? banks.map((bank) => `banks[]=${bank}`).join('&')
    : '';
  const typesParams = jobs.length
    ? jobs.map((job) => `jobs[]=${job}`).join('&')
    : '';
  const statusParams = statuses.length
    ? statuses.map((status) => `statuses[]=${status}`).join('&')
    : '';

  const params = [
    `page=${page}`,
    `count=${count}`,
    resolved !== undefined && resolved !== null ? `resolved=${resolved}` : '',
    startDate ? `startDate=${startDate}` : '',
    endDate ? `endDate=${endDate}` : '',
    merchantParams,
    bankParams,
    statusParams,
    typesParams
  ]
    .filter(Boolean)
    .join('&');
    

  const response = await axios.get(
    `${app.api}/${url}?${params}`
  );
  return response.data;
};
