import { format } from 'date-fns';

const formatDate = (val) => {
  if (val !== undefined && val !== '') {
    return new Date(val).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }
  return '';
};

const toLocaleDateTime = (val, withoutTime = false) => {
  const timeFormat = ['yyyy-MM-dd', withoutTime ? '' : 'HH:mm:ss']
    .join(' ')
    .trim();
  if (val !== undefined && val !== '') {
    return format(new Date(val), timeFormat);
  }
  return '';
};

export const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd');

export { formatDate, toLocaleDateTime };
