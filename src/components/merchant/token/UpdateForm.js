import { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  FormHelperText,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { Edit } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { showConfirm } from "@slices/dialog";

const UpdateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [privateKey, setPrivateKey] = useState(true);

  return (
    <Formik
      initialValues={{
        secret: data.secret,
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({})}
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
                  error={Boolean(touched.secret && errors.secret)}
                  disabled={privateKey}
                  fullWidth
                  helperText={touched.secret && errors.secret}
                  label={t("secret token")}
                  margin="normal"
                  name="secret"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  value={values.secret}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  InputProps={{
                    endAdornment: privateKey ? (
                      <Edit
                        onClick={() => {
                          dispatch(
                            showConfirm({
                              title: t("Do you want to update token"),
                              isOpen: true,
                              okCallback: () => {
                                setPrivateKey(false);
                              },
                            })
                          );
                        }}
                      />
                    ) : null,
                  }}
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
