import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const AuthTransitAccount = ({ onAuthSuccess }) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        username: '',
        password: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required(t('required')),
        password: Yup.string().max(255).required(t('required'))
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          console.log('auth successful');
          onAuthSuccess();
        } catch (err) {
          setErrors({ submit: 'Authentication failed' });
        } finally {
          setSubmitting(false);
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
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            autoFocus
            error={Boolean(touched.username && errors.username)}
            fullWidth
            helperText={touched.username && errors.username}
            label="User name"
            margin="normal"
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={values.email}
            variant="outlined"
          />
          <TextField
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {t('Login text')}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AuthTransitAccount;
