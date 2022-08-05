export const getInitialMerchantValue = (data = {}) => {
  return {
    name: data.name || '',
    description: data.description || '',
    timezoneId: data.timezone || '',
    percentFee: data.percentFee || '',
    minAmountFee: data.minAmountFee || '',
    fixAmountFee: data.fixAmountFee || 0,
    cityTerminalId: data.cityTerminalId || '',
    cityMerchantId: data.cityMerchantId || '',
    businessName: data.businessName || '',
    contractNumber: data.contractNumber || '',
    contractDate: data.contractDate || '',
    design: data.design || ''
  };
};
