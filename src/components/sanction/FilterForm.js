import * as Yup from 'yup';
import { Formik, useFormik, useFormikContext } from 'formik';
import {
  Box,
  FormHelperText,
  TextField,
  Grid,
  MenuItem,
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';
import axios from '@lib/axios';
import { app } from '@root/config';


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

const FilterForm = ({ onSubmit, ...props }) => {
  const mounted = useMounted();
  const { t } = useTranslation();

  const [sources, setSources] = useState([]);
  const getSources = async () => {
    await axios.get(`${app.api}/sanction/sources`).then((response) => {
      setSources(response.data);
    });
  };

  useEffect(() => {
    getSources();
  }, []);



  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  }

  const initialValues =
  {
    source: '',
    firstName: '',
    lastName: '',
    docRef: '',
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
                  error={Boolean(touched.source && errors.source)}
                  fullWidth
                  helperText={touched.source && errors.source}
                  label={t("source")}
                  name="source"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  select
                  value={values.source}
                  margin="normal"
                  size="small"
                >
                  <MenuItem value={""}>
                    {t("Select value")}
                  </MenuItem>
                  {sources.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.firstName && errors.firstName)}
                  fullWidth
                  helperText={touched.firstName && errors.firstName}
                  label={t('firstName')}
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.lastName && errors.lastName)}
                  fullWidth
                  helperText={touched.lastName && errors.lastName}
                  label={t('lastName')}
                  margin="normal"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.docRef && errors.docRef)}
                  fullWidth
                  helperText={touched.docRef && errors.docRef}
                  label={t('docRef')}
                  margin="normal"
                  name="docRef"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.docRef}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
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

export default FilterForm;
