// src/components/authentication/login/LoginJWT.js
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Button, FormHelperText, TextField } from "@material-ui/core";
import useAuth from "@hooks/useAuth";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LoginJWT = (props) => {
    const mounted = useMounted();
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string().email(t("email")).max(255).required(t("required")),
                password: Yup.string().max(255).required(t("required")),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    await login(values.email, values.password);

                    if (mounted.current) {
                        setStatus({ success: true });
                        setSubmitting(false);
                    }
                } catch (err) {
                    console.error(err);

                    // Проверяем, требуется ли 2FA
                    if (err.response && err.response.status === 401) {
                        if (err.response.data &&
                            err.response.data.error === 'access_denied' &&
                            err.response.data.two_factor_complete === false) {

                            navigate('/authentication/two-factor');
                            return;
                        }
                    }

                    if (mounted.current) {
                        setStatus({ success: false });
                        setErrors({ submit: err.response?.data?.message || err.message });
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
                <form noValidate onSubmit={handleSubmit} {...props}>
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
                            {t("Login text")}
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

export default LoginJWT;
