import { format } from 'date-fns';

const formatDate = (val) => {
  if (val !== undefined && val !== '') {
    return new Date(val).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }
  return '';
};

const toLocaleDateTime = (val) => {
  if (val !== undefined && val !== '') {
    return format(new Date(val), 'yyyy-MM-dd  HH:mm:ss');
  }
  return '';
};

export { formatDate, toLocaleDateTime };
