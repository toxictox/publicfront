export const formatCurrency = (amount, currency = 'KZT') => {
  return `${new Intl.NumberFormat('ru', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0)} ${currency}`;
};
