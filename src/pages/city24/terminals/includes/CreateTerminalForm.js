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
import { fields } from "@lib/validate";

const UpdateForm = (props) => {
  const mounted = useMounted();
  const { callback } = props;
  const { t } = useTranslation();
  const [gatewayMethod, setGatewayMethod] = useState([]);
  const [merchantList, setMerchantList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/terminal/merchants`).then((response) => {
        setMerchantList(response.data.data);
      });

      await axios.get(`${app.api}/filter/gateway/methods`).then((response) => {
        setGatewayMethod(response.data.data);
      });
    };
    getData();
  }, []);

  return (
    <Formik
      initialValues={{
        terminalId: "",
        extId: "",
        memberId: "",
        terminalType: "",
        cityCode: "",
        cityName: "",
        regionName: "",
        street: "",
        house: "",
        comment: "",
        isActive: 1,
      }}
      validationSchema={Yup.object().shape({
        terminalId: Yup.string().required(t("required")),
        extId: Yup.string().required(t("required")),
        memberId: Yup.string().required(t("required")),
        terminalType: Yup.string().required(t("required")),
        cityCode: Yup.string().required(t("required")),
        cityName: Yup.string().required(t("required")),
        regionName: Yup.string().required(t("required")),
        street: Yup.string().required(t("required")),
        house: Yup.string().required(t("required")),
        comment: Yup.string().required(t("required")),
        isActive: Yup.number().typeError(t("field number")),
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
                  error={Boolean(touched.terminalId && errors.terminalId)}
                  fullWidth
                  helperText={touched.terminalId && errors.terminalId}
                  label={t("terminalId")}
                  margin="normal"
                  name="terminalId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.terminalId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.extId && errors.extId)}
                  fullWidth
                  helperText={touched.extId && errors.extId}
                  label={t("extId")}
                  margin="normal"
                  name="extId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.extId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.memberId && errors.memberId)}
                  fullWidth
                  helperText={touched.memberId && errors.memberId}
                  label={t("memberId")}
                  margin="normal"
                  name="memberId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.memberId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.terminalType && errors.terminalType)}
                  fullWidth
                  helperText={touched.terminalType && errors.terminalType}
                  label={t("terminalType")}
                  margin="normal"
                  name="terminalType"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.terminalType}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.cityCode && errors.cityCode)}
                  fullWidth
                  helperText={touched.cityCode && errors.cityCode}
                  label={t("cityCode")}
                  margin="normal"
                  name="cityCode"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.cityCode}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.cityName && errors.cityName)}
                  fullWidth
                  helperText={touched.cityName && errors.cityName}
                  label={t("cityName")}
                  margin="normal"
                  name="cityName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.cityName}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.regionName && errors.regionName)}
                  fullWidth
                  helperText={touched.regionName && errors.regionName}
                  label={t("regionName")}
                  margin="normal"
                  name="regionName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.regionName}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.street && errors.street)}
                  fullWidth
                  helperText={touched.street && errors.street}
                  label={t("street")}
                  margin="normal"
                  name="street"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.street}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.house && errors.house)}
                  fullWidth
                  helperText={touched.house && errors.house}
                  label={t("house")}
                  margin="normal"
                  name="house"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.house}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.comment && errors.comment)}
                  fullWidth
                  helperText={touched.comment && errors.comment}
                  label={t("comment")}
                  margin="normal"
                  name="comment"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.comment}
                  variant="outlined"
                  size="small"
                  rows={4}
                  multiline={true}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched.isActive && errors.isActive)}
                  fullWidth
                  helperText={touched.isActive && errors.isActive}
                  label="isActive"
                  name="isActive"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  select
                  size="small"
                  value={values.isActive}
                  variant="outlined"
                >
                  <MenuItem value={1}>{t("Select active")}</MenuItem>
                  <MenuItem value={0}>{t("Select inactive")}</MenuItem>
                </TextField>
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
