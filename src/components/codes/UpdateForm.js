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

const UpdateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        external: data.external,
        internal: data.internal,
        color: data.color,
        langEn: data.langEn,
        langRu: data.langRu,
        langUk: data.langUk,
      }}
      validationSchema={Yup.object().shape({
        external: Yup.string().max(255).required(t("required")),
        internal: Yup.string().max(255).required(t("required")),
        color: Yup.string().max(255).nullable(),
        langEn: Yup.string().max(255).required(t("required")),
        langRu: Yup.string().max(255).required(t("required")),
        langUk: Yup.string().max(255).required(t("required")),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback(values);

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
              <Grid item xs={12}>
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
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.internal && errors.internal)}
                  fullWidth
                  helperText={touched.internal && errors.internal}
                  label={t("internal")}
                  margin="normal"
                  name="internal"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.internal}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.color && errors.color)}
                  fullWidth
                  helperText={touched.color && errors.color}
                  label={t("color")}
                  margin="normal"
                  name="color"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.color}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  autoFocus
                  error={Boolean(touched.langEn && errors.langEn)}
                  fullWidth
                  helperText={touched.langEn && errors.langEn}
                  label={t("langEn")}
                  margin="normal"
                  name="langEn"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.langEn}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  autoFocus
                  error={Boolean(touched.langRu && errors.langRu)}
                  fullWidth
                  helperText={touched.langRu && errors.langRu}
                  label={t("langRu")}
                  margin="normal"
                  name="langRu"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.langRu}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  autoFocus
                  error={Boolean(touched.langUk && errors.langUk)}
                  fullWidth
                  helperText={touched.langUk && errors.langUk}
                  label={t("langUk")}
                  margin="normal"
                  name="langUk"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.langUk}
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
                    size="large"
                  >
                    {t("Update button")}
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

export default UpdateForm;
