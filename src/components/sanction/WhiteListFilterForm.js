import * as Yup from 'yup';
import { Formik, useFormik, useFormikContext } from 'formik';
import {
  Box,
  FormHelperText,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';
import useAuth from '@hooks/useAuth';


const AutoSubmit = () => {
  const [timer, setTimer] = useState(undefined);
  const submitDelay = 600;
  const formikContext = useFormikContext();


  const timeoutSubmit = () => {
      clearTimeout(timer);
      setTimer(setTimeout(
        () => {formikContext.submitForm()},
        submitDelay
      ));
    };

  useEffect(() => {
    timeoutSubmit();
  }, [formikContext.values, formikContext.submitForm]);

  return null;
}

const WhiteListFilterForm = ({ onSubmit, ...props }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
  }, []);

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  }

  const initialValues =
  {
    merchant: '',
    showDeleted: false,
  };

  const validationSchema = Yup.object().shape({});

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                    error={Boolean(touched.merchant && errors.merchant)}
                    fullWidth
                    helperText={touched.merchant && errors.merchant}
                    label={t('merchant')}
                    name="merchant"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    select
                    value={values.merchant}
                    margin="normal"
                >
                    <MenuItem value={""}>
                    {t("Select value")}
                    </MenuItem>
                    {user.merchants.map((item) => (
                        <MenuItem key={item.merchantId} value={item.merchantId}>
                            {item.merchantName}
                        </MenuItem>
                    ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                  <FormControlLabel control={
                      <Switch
                          checked={values.showDeleted}
                          name="showDeleted"
                          onChange={handleChange}
                          color={values.showDeleted ? "success" : "error"}
                      />}
                      label={values.showDeleted ? t("Show deleted") : t("Hide deleted")}
                  />
              </Grid>
            </Grid>
          </Box>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <AutoSubmit />
        </form>
      )}
    </Formik>
  );
};

export default WhiteListFilterForm;
