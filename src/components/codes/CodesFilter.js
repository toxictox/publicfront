import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";

const TransactionFilter = (props) => {
  const mounted = useMounted();
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        external: "",
      }}
      validationSchema={Yup.object().shape({
        external: Yup.string().max(255),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await props.callback(values);

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
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.external && errors.external)}
                  fullWidth
                  helperText={touched.external && errors.external}
                  label={t("external")}
                  margin="normal"
                  name="external"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.external}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <Box sx={{ mt: 1 }}>
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
