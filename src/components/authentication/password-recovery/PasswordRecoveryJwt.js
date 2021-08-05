import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, FormHelperText, TextField } from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import useAuth from "@hooks/useAuth";

const PasswordRecoverJwt = () => {
  const mounted = useMounted();
  const navigate = useNavigate();
  const { passwordRecovery } = useAuth();
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{
        email: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email(t("email")).max(255).required(t("required")),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          passwordRecovery(values.email);
        } catch (err) {
          console.error(err);
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
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            autoFocus
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            label="Email Address"
            margin="normal"
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <Button
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {t("Recovery button")}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default PasswordRecoverJwt;
