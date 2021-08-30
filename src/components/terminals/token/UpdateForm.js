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
  const [publicKey, setPublicKey] = useState(true);
  const [clientKey, setClientKey] = useState(true);
  return (
    <Formik
      initialValues={{
        private: data.private,
        public: data.public,
        rsa: data.rsa,
      }}
      validationSchema={Yup.object().shape({
        private: Yup.string().min(20).required(t("required")),
        public: Yup.string().min(20).required(t("required")),
        rsa: Yup.string().min(20).required(t("required")),
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
                  error={Boolean(touched.private && errors.private)}
                  disabled={privateKey}
                  fullWidth
                  helperText={touched.private && errors.private}
                  label={t("private token")}
                  margin="normal"
                  name="depositLimit"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  value={values.private}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  InputProps={{
                    endAdornment: (
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
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.public && errors.public)}
                  fullWidth
                  disabled={publicKey}
                  helperText={touched.public && errors.public}
                  label={t("public token")}
                  margin="normal"
                  name="public"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  value={values.public}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  InputProps={{
                    endAdornment: (
                      <Edit
                        onClick={() => {
                          dispatch(
                            showConfirm({
                              title: t("Do you want to update token"),
                              isOpen: true,
                              okCallback: () => setPublicKey(false),
                            })
                          );
                        }}
                      />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.rsa && errors.rsa)}
                  fullWidth
                  disabled={clientKey}
                  helperText={touched.rsa && errors.rsa}
                  label={t("rsa token")}
                  margin="normal"
                  name="rsa"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  value={values.rsa}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  InputProps={{
                    endAdornment: (
                      <Edit
                        onClick={() => {
                          dispatch(
                            showConfirm({
                              title: t("Do you want to update token"),
                              isOpen: true,
                              okCallback: () => setClientKey(false),
                            })
                          );
                        }}
                      />
                    ),
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
