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

const DepositForm = (props) => {
  const { cb, cancel, bankId, action } = props;
  const mounted = useMounted();
  const { t } = useTranslation();
  const getButtonTranslate = (action) => {
    switch (action) {
      case "increase":
        return t("Increase deposit limit");
      case "set":
        return t("Set deposit limit");
      case "decrease":
        return t("Decrease deposit limit");
      default:
        return t("Update button");
    }
  };
  return (
    <Formik
      initialValues={{
        depositLimit: 0,
        bankId: bankId,
        action: action,
        comment: "",
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        comment: Yup.string().required(),
        depositLimit: Yup.number()
          .typeError("Должно быть числовое значение")
          .min(0, "Минимум 0")
          .required(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await cb(values);

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
          <Box
            sx={{
              marginTop: 1,
              marginBottom: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.depositLimit && errors.depositLimit)}
                  fullWidth
                  helperText={touched.depositLimit && errors.depositLimit}
                  label={t("depositLimit")}
                  margin="normal"
                  name="depositLimit"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.depositLimit}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mt: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.comment && errors.comment)}
                  fullWidth
                  multiline
                  rows={3}
                  helperText={touched.comment && errors.comment}
                  label={t("depositComment")}
                  margin="normal"
                  name="comment"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.comment}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item>
                <Box sx={{ mt: 1 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="small"
                  >
                    {getButtonTranslate(action)}
                  </Button>
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    type="button"
                    variant="contained"
                    size="small"
                    onClick={cancel}
                    sx={{ marginLeft: 1 }}
                  >
                    {t("Cancel button")}
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

export default DepositForm;
