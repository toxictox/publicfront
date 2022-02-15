import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  MenuItem,
  Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";
import { fields } from "@lib/validate";

const CreateMerchantForm = (props) => {
  const mounted = useMounted();
  const { callback } = props;
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{
        terminalId: "",
        extId: "",
        memberId: "",
        okpo: "",
        merchantName: "",
        contractNumber: "",
        contractDate: "",
        mfo: "",
        accountNumber: "",
        serviceName: "",
        serviceType: "",
        tranDest: "",
        postIndex: "",
        city: "",
        street: "",
        building: "",
        office: "",
      }}
      validationSchema={Yup.object().shape({
        terminalId: Yup.string().required(t("required")),
        extId: Yup.string().required(t("required")),
        memberId: Yup.string().required(t("required")),
        okpo: Yup.string().required(t("required")),
        merchantName: Yup.string().required(t("required")),
        contractNumber: Yup.string().required(t("required")),
        contractDate: Yup.string().required(t("required")),
        mfo: Yup.string().required(t("required")),
        accountNumber: Yup.string().required(t("required")),
        serviceName: Yup.string().required(t("required")),
        postIndex: Yup.string().required(t("required")),
        city: Yup.string().required(t("required")),
        street: Yup.string().required(t("required")),
        building: Yup.string().required(t("required")),
        office: Yup.string().required(t("required")),
        serviceType: Yup.string().required(t("required")),
        tranDest: Yup.string().required(t("required")),
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
              <Grid item xs={6}>
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
                      error={Boolean(touched.okpo && errors.okpo)}
                      fullWidth
                      helperText={touched.okpo && errors.okpo}
                      label={t("okpo")}
                      margin="normal"
                      name="okpo"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.okpo}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(
                        touched.merchantName && errors.merchantName
                      )}
                      fullWidth
                      helperText={touched.merchantName && errors.merchantName}
                      label={t("merchantName")}
                      margin="normal"
                      name="merchantName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.merchantName}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(
                        touched.contractNumber && errors.contractNumber
                      )}
                      fullWidth
                      helperText={
                        touched.contractNumber && errors.contractNumber
                      }
                      label={t("contractNumber")}
                      margin="normal"
                      name="contractNumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.contractNumber}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(
                        touched.contractDate && errors.contractDate
                      )}
                      fullWidth
                      helperText={touched.contractDate && errors.contractDate}
                      label={t("contractDate")}
                      margin="normal"
                      name="contractDate"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.contractDate}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.mfo && errors.mfo)}
                      fullWidth
                      helperText={touched.mfo && errors.mfo}
                      label={t("mfo")}
                      margin="normal"
                      name="mfo"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.mfo}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(
                        touched.accountNumber && errors.accountNumber
                      )}
                      fullWidth
                      helperText={touched.accountNumber && errors.accountNumber}
                      label={t("accountNumber")}
                      margin="normal"
                      name="accountNumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.accountNumber}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.serviceName && errors.serviceName)}
                      fullWidth
                      helperText={touched.serviceName && errors.serviceName}
                      label={t("serviceName")}
                      margin="normal"
                      name="serviceName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.serviceName}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.serviceType && errors.serviceType)}
                      fullWidth
                      helperText={touched.serviceType && errors.serviceType}
                      label={t("serviceType")}
                      margin="normal"
                      name="serviceType"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.serviceType}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.tranDest && errors.tranDest)}
                      fullWidth
                      helperText={touched.tranDest && errors.tranDest}
                      label={t("tranDest")}
                      margin="normal"
                      name="tranDest"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.tranDest}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.postIndex && errors.postIndex)}
                      fullWidth
                      helperText={touched.postIndex && errors.postIndex}
                      label={t("postIndex")}
                      margin="normal"
                      name="postIndex"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.postIndex}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.city && errors.city)}
                      fullWidth
                      helperText={touched.city && errors.city}
                      label={t("city")}
                      margin="normal"
                      name="city"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.city}
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
                      error={Boolean(touched.building && errors.building)}
                      fullWidth
                      helperText={touched.building && errors.building}
                      label={t("building")}
                      margin="normal"
                      name="building"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.building}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      error={Boolean(touched.office && errors.office)}
                      fullWidth
                      helperText={touched.office && errors.office}
                      label={t("office")}
                      margin="normal"
                      name="office"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.office}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0 }}
                    />
                  </Grid>
                </Grid>
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

export default CreateMerchantForm;
