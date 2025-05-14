import * as Yup from 'yup';
import { fields } from '@lib/validate';

export const getValidationMerchantSchema = (t) => {
  return Yup.object().shape({
    name: Yup.string().max(255).required(t('required')),
    description: Yup.string().max(255),
    percentFee: Yup.string().matches(fields.decimal, t('field float')),
    minAmountFee: Yup.number().typeError(t('field number')),
    fixAmountFee: Yup.number(),
    businessName: Yup.string().notRequired(),
    contractNumber: Yup.string().notRequired(),
    contractDate: Yup.string(),
    timezone: Yup.string().max(255).required(t('required')),
    design: Yup.number().when("newDesign.name", {
      is: undefined,
      then: Yup.number().max(40).required(t('required')),
      otherwise: Yup.number().notRequired(),
    }),
    type: Yup.string().notRequired(),
    notificationChannel: Yup.string().notRequired(),
    company: Yup.number().when("newCompany.name", {
      is: undefined,
      then: Yup.number().required(t('required')),
      otherwise: Yup.number().notRequired(),
    }),
    newCompany: Yup.object().shape({
      // name: Yup.string()
      //   .when("$company", {
      //     is: (company) => !company || company === '',
      //     then: Yup.string().required(t('required')),
      //     otherwise: Yup.string().notRequired(),
      //   }),
      companyEmail: Yup.string().notRequired(),
      iin: Yup.string().notRequired(),
      bankAccountNumber: Yup.string().notRequired()
    }),
  });
};
