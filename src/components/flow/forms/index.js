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

const TitleFlowform = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        flowName: "",
      }}
      validationSchema={Yup.object().shape({
        flowName: Yup.string().max(255).required(t("required")),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await props.callback(values.flowName);

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
        submitForm,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form
          noValidate
          onChange={(e) => {
            handleChange(e);
          }}
          {...props}
        >
          <Box m={0}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.flowName && errors.flowName)}
                  fullWidth
                  helperText={touched.flowName && errors.flowName}
                  label={t("flowName")}
                  margin="normal"
                  name="flowName"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setTimeout(submitForm, 0);
                  }}
                  type="text"
                  value={values.flowName}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
            </Grid>
          </Box>

          {errors.submit && (
            <Box sx={{ mt: 1 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
        </form>
      )}
    </Formik>
  );
};

export default TitleFlowform;
