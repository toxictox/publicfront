import * as Yup from 'yup';
import { Formik, useFormikContext } from 'formik';
import {
  Box,
  FormHelperText,
  Grid,
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';
import { SelectCheckbox } from '@comp/core/forms';


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

const RuleFilterForm = ({ onSubmit, ...props }) => {
  const mounted = useMounted();
  const { t } = useTranslation();

  const [tranTypes, setTranTypes] = useState([]);
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    axios.get(`${app.api}/filter/tran_types`).then((response) => {
      setTranTypes(response.data.map((item) => {return {id: item.name, name: item.name}}));
    });

    axios.get(`${app.api}/filter/merchants`).then((response) => {
      setMerchants(response.data.data);
    });
  }, []);



  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  }

  const initialValues =
  {
    transactionTypes: [],
    merchants: [],
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
            <Grid container>
              <Grid item xs={12} md={6}>
                <SelectCheckbox
                  error={Boolean(touched.transactionTypes && errors.transactionTypes)}
                  labelId="transactionTypes"
                  helperText={touched.transactionTypes && errors.transactionTypes}
                  label={t('transactionTypes')}
                  name="transactionTypes"
                  onBlur={handleBlur}
                  value={values.transactionTypes}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    console.log(values);
                    setFieldValue('transactionTypes', e.target.value);
                  }}
                  items={tranTypes}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <SelectCheckbox
                  error={Boolean(touched.merchants && errors.merchants)}
                  labelId="merchants"
                  helperText={touched.merchants && errors.merchants}
                  label={t('merchants')}
                  name="merchants"
                  onBlur={handleBlur}
                  value={values.merchants}
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue('merchants', e.target.value);
                  }}
                  items={merchants}
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

export default RuleFilterForm;
