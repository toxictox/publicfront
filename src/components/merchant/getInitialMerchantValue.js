export const getInitialMerchantValue = (data = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    description: data.description || '',
    timezone: data.timezone || '',
    businessName: data.businessName || '',
    contractNumber: data.contractNumber || '',
    contractDate: data.contractDate || '',
    design: data.design || '',
    type: data.type || '',
    notificationChannel: data.notificationChannel || '',
    company: data.company || '',
    newCompany: data.newCompany || {},
    newDesign: data.newDesign || {},
  };
};
