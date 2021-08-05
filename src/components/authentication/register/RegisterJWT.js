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
        email: "",
        name: "",
        password: "",
        repassword: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email(t("email")).max(255).required(t("required")),
        name: Yup.string().max(255).required(t("required")),
        password: Yup.string().min(7).max(60).required(t("required")),
        repassword: Yup.string()
          .min(7)
          .oneOf([Yup.ref("password"), null], t("Passwords must match"))
          .max(60)
          .required(t("required")),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          if (values.password === values.repassword) {
            await register(
              values.email,
              values.name,
              values.password,
              params.token
            );
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
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            variant="outlined"
          />
          <TextField
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
            label="Password"
            margin="normal"
            name="repassword"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.repassword}
            variant="outlined"
          />

          {/*{Boolean(touched.policy && errors.policy) && (*/}
          {/*  <FormHelperText error>{errors.policy}</FormHelperText>*/}
          {/*)}*/}
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
