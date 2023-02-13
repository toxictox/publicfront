import * as Yup from 'yup';
import { fields } from '@lib/validate';

export const getValidationMerchantSchema = (t) => {
  return Yup.object().shape({
    name: Yup.string().max(255).required(t('required')),
    description: Yup.string().max(255),
    percentFee: Yup.string().matches(fields.decimal, t('field float')),
    minAmountFee: Yup.number().typeError(t('field number')),
    fixAmountFee: Yup.number(),
    businessName: Yup.string(),
    contractNumber: Yup.string(),
    contractDate: Yup.string(),
    timezoneId: Yup.string().max(255).required(t('required')),
    design: Yup.number().max(40).required(t('required')),
    type: Yup.string().required(t('required')),
    notificationChannel: Yup.string().required(t('required')),
    company_id: Yup.number().max(255).required(t('required')),
    company_email: Yup.string()
      .email(t('email'))
      .max(255)
      .required(t('required'))
  });
};
