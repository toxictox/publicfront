import { format } from 'date-fns';
import moment from 'moment';

const formatDate = (val) => {
  if (val !== undefined && val !== '') {
    return new Date(val).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  }
  return '';
};

const getMomentDate = (date) => {
  return moment.utc(moment(date)).format('yyyy-MM-DD HH:mm:ss');
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

const toLocaleDateTimeWithTimeZone = (val) => {
  if (val !== undefined && val !== '') {
    return format(new Date(val), 'yyyy-MM-dd HH:mm:ss XXXXX');
  }
  return '';
};

export const getCurrentDate = (value) =>
  format(value ? new Date(value) : new Date(), 'yyyy-MM-dd HH:mm:ss');

export {
  formatDate,
  toLocaleDateTime,
  toLocaleDateTimeWithTimeZone,
  getMomentDate
};
