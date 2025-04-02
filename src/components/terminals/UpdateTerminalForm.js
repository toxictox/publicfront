import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";
import { fields } from "@lib/validate";
import DynamicFieldsSet from '@comp/form/DynamicFieldsSet';

const UpdateTerminalForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const [gatewayMethod, setGatewayMethod] = useState([]);
  const [merchantList, setMerchantList] = useState([]);
  const [accountList, setAccountList] = useState({
    items: []
  });

  const getAccounts = (merchant) => {
    if (merchant) {
      axios.get(`${app.api}/merchant/${merchant}/account`,
        {
          params: {
            count: 100
          }
        }
      ).then((response) => {
        setAccountList(response.data);
      });
    }
  };

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/merchants`).then((response) => {
        setMerchantList(response.data.data);
      });

      await axios.get(`${app.api}/filter/gateway/methods`).then((response) => {
        setGatewayMethod(response.data.data);
      });

      getAccounts(data.merchant);
    };
    getData();
  }, []);

  return (
    <Formik
      initialValues={{
        name: data.data.name,
        tid: data.data.tid,
        gatewayMethod: data.data.gatewayMethod,
        merchant: data.data.merchant,
        account: data.data.account,
        showOnDashboard: data.data.showOnDashboard,
        dashboardLabel: data.data.dashboardLabel,
        options: data.settings
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required(t("required")),
        tid: Yup.string().max(255),
        gatewayMethod: Yup.string().max(5).required(t("required")),
        merchant: Yup.string().required(t("required")),
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
                <FormControlLabel control={
                    <Switch
                        checked={values.showOnDashboard}
                        name='showOnDashboard'
                        onChange={handleChange}
                        color={values.showOnDashboard ? "success" : "error"}
                    />}
                    label={values.showOnDashboard ? t("Display in sidebar balances") : t("Hide in sidebar balances")}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.dashboardLabel && errors.dashboardLabel)}
                  fullWidth
                  helperText={touched.dashboardLabel && errors.dashboardLabel}
                  label={t("dashboardLabel")}
                  margin="normal"
                  name="dashboardLabel"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.dashboardLabel}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
                <DynamicFieldsSet
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={errors}
                    name='options'
                    value={values.options}
                    fields={data.form}
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

export default UpdateTerminalForm;
