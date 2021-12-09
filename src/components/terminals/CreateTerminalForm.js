import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  MenuItem,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";

const UpdateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const [gatewayMethod, setGatewayMethod] = useState([]);
  const [merchantList, setMerchantList] = useState([]);

  useEffect(async () => {
    await axios.get(`${app.api}/terminal/merchants`).then((response) => {
      setMerchantList(response.data.data);
    });

    await axios.get(`${app.api}/terminal/gateway/methods`).then((response) => {
      setGatewayMethod(response.data.data);
    });
  }, []);

  return (
    <Formik
      initialValues={{
        name: "",
        tid: "",
        gatewayMethodId: "",
        merchantId: "",
        endpoint: "",
        wsdlUrl: "",
        // depositLimit: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required(t("required")),
        tid: Yup.string().max(255),
        endpoint: Yup.string().max(255),
        wsdlUrl: Yup.string().max(255),
        gatewayMethodId: Yup.string().max(5).required(t("required")),
        merchantId: Yup.string().required(t("required")),
        // depositLimit: Yup.string().max(255).required(t("required")),
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
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label={t("name")}
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.name}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.tid && errors.tid)}
                  fullWidth
                  helperText={touched.tid && errors.tid}
                  label={t("tid")}
                  margin="normal"
                  name="tid"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.tid}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(
                    touched.gatewayMethodId && errors.gatewayMethodId
                  )}
                  fullWidth
                  helperText={touched.gatewayMethodId && errors.gatewayMethodId}
                  label="gatewayMethodId"
                  name="gatewayMethodId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  select
                  size="small"
                  value={values.gatewayMethodId}
                  variant="outlined"
                >
                  <MenuItem key={-1} value={""}>
                    {t("Select value")}
                  </MenuItem>
                  {gatewayMethod.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.merchantId && errors.merchantId)}
                  fullWidth
                  helperText={touched.merchantId && errors.merchantId}
                  label="merchantId"
                  name="merchantId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  select
                  size="small"
                  value={values.merchantId}
                  variant="outlined"
                >
                  <MenuItem key={-1} value={""}>
                    {t("Select value")}
                  </MenuItem>
                  {merchantList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.endpoint && errors.endpoint)}
                  fullWidth
                  helperText={touched.endpoint && errors.endpoint}
                  label={t("endpoint")}
                  margin="normal"
                  name="endpoint"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.endpoint}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.wsdlUrl && errors.wsdlUrl)}
                  fullWidth
                  helperText={touched.wsdlUrl && errors.wsdlUrl}
                  label={t("wsdlUrl")}
                  margin="normal"
                  name="wsdlUrl"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.wsdlUrl}
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
                    {t("Create button")}
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
