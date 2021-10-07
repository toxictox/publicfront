import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, FormHelperText, TextField } from "@material-ui/core";
import useAuth from "@hooks/useAuth";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const RegisterJWT = (props) => {
  const mounted = useMounted();
  const { register } = useAuth();
  const { t } = useTranslation();
  const params = useParams();

  return (
    <Formik
      initialValues={{
        phone: "",
        password: "",
        repassword: "",
      }}
      validationSchema={Yup.object().shape({
        phone: Yup.string()
          .max(255)
          .trim()
          .matches(/^38(0\d{9})$/, t("Error phone format"))
          .required(t("required")),
        password: Yup.string()
          .min(8)
          .trim()
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            t("Error password format")
          )
          .required(t("required")),
        repassword: Yup.string()
          .min(8)
          .oneOf([Yup.ref("password"), null], t("Passwords must match"))
          .max(60)
          .required(t("required")),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          if (values.password === values.repassword) {
            console.log(values, params);
            await register(values.phone, values.password, params.token);
          } else {
            setStatus({ success: false });
            setErrors({ submit: "asdsdsds" });
            setSubmitting(false);
          }

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
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
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <TextField
            error={Boolean(touched.phone && errors.phone)}
            fullWidth
            helperText={touched.phone && errors.phone}
            label="Phone"
            margin="normal"
            name="phone"
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

          <TextField
            error={Boolean(touched.repassword && errors.repassword)}
            fullWidth
            helperText={touched.repassword && errors.repassword}
            label="rePassword"
            margin="normal"
            name="repassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.repassword}
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
              {t("Register account")}
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default RegisterJWT;
