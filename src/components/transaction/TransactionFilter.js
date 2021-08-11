import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
} from "@material-ui/core";
import useAuth from "@hooks/useAuth";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";

const TransactionFilter = (props) => {
  const mounted = useMounted();
  const { login } = useAuth();
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        tranId: "",
        tranType: "",
        amount: "",
        merchant: "",
        gateway: "",
        respCode: "",
      }}
      validationSchema={Yup.object().shape({
        tranId: Yup.string().max(255),
        //email: Yup.string().email(t("email")).max(255).required(t("required")),
        tranType: Yup.string().max(255),
        amount: Yup.string().max(255),
        merchant: Yup.string().max(255),
        createOn: Yup.string().max(255),
        gateway: Yup.string().max(255),
        respCode: Yup.string().max(255),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await props.callback(values);

          if (mounted.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
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
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  autoFocus
                  error={Boolean(touched.createOn && errors.createOn)}
                  fullWidth
                  helperText={touched.createOn && errors.createOn}
                  label={t("createOn")}
                  margin="normal"
                  name="createOn"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="date"
                  value={values.createOn}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  autoFocus
                  error={Boolean(touched.tranId && errors.tranId)}
                  fullWidth
                  helperText={touched.tranId && errors.tranId}
                  label={t("tranId")}
                  margin="normal"
                  name="tranId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.tranId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.tranType && errors.tranType)}
                  fullWidth
                  helperText={touched.tranType && errors.tranType}
                  label={t("tranType")}
                  margin="normal"
                  name="tranType"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.tranType}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.amount && errors.amount)}
                  fullWidth
                  helperText={touched.amount && errors.amount}
                  label={t("amount")}
                  margin="normal"
                  name="amount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.amount}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.merchant && errors.merchant)}
                  fullWidth
                  helperText={touched.merchant && errors.merchant}
                  label={t("merchant")}
                  margin="normal"
                  name="merchant"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.merchant}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.gateway && errors.gateway)}
                  fullWidth
                  helperText={touched.gateway && errors.gateway}
                  label={t("gateway")}
                  margin="normal"
                  name="gateway"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.gateway}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.respCode && errors.respCode)}
                  fullWidth
                  helperText={touched.respCode && errors.respCode}
                  label={t("respCode")}
                  margin="normal"
                  name="respCode"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.respCode}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="small"
                  >
                    {t("Search button")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
        </form>
      )}
    </Formik>
  );
};

export default TransactionFilter;
