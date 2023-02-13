export const getInitialMerchantValue = (data = {}) => {
  return {
    name: data.name || '',
    description: data.description || '',
    timezoneId: data.timezone || '',
    percentFee: data.percentFee || '',
    minAmountFee: data.minAmountFee || '',
    fixAmountFee: data.fixAmountFee || 0,
    businessName: data.businessName || '',
    contractNumber: data.contractNumber || '',
    contractDate: data.contractDate || '',
    design: data.design || '',
    type: data.type || '',
    notificationChannel: data.notificationChannel || '',
    company_email: data.company_email || '',
    company_id: data.company_id || ''
  };
};
