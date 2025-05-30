import { Formik } from 'formik';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import { UseMerchantFormData } from './useMerchantFormData';
import CreateAndUpdateMerchantForm from './CreateAndUpdateMerchantForm';
import { getInitialMerchantValue } from './getInitialMerchantValue';
import { getValidationMerchantSchema } from './ValidationMerchantSchema';

const CreateForm = (props) => {
  const mounted = useMounted();
  const { callback } = props;
  const { t } = useTranslation();
  const {
    timezoneData,
    designId,
    types,
    notificationChannels,
    companies
  } = UseMerchantFormData();

  return (
    <Formik
      initialValues={getInitialMerchantValue()}
      validationSchema={getValidationMerchantSchema(t)}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback(values);

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          if (mounted.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <CreateAndUpdateMerchantForm
          errors={errors}
          handleBlur={handleBlur}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          touched={touched}
          values={values}
          timezoneData={timezoneData}
          companies={companies}
          designId={designId}
          types={types}
          notificationChannels={notificationChannels}
          externalProps={props}
        />
      )}
    </Formik>
  );
};

export default CreateForm;
