import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  Divider,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
} from "@material-ui/core";
import useAuth from "@hooks/useAuth";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { formatDate } from "@lib/date";
import { app } from "@root/config";
import fields from "@comp/export/fields";

const ExportFileFilter = (props) => {
  const mounted = useMounted();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [banks, setBanks] = useState([]);
  const [tran, setTran] = useState([]);
  const [tranType, setTranType] = useState([]);
  const [merchant, setMerchant] = useState([]);
  const [respCode, setRespCode] = useState([]);

  useEffect(async () => {
    // await axios.get(`${app.api}/banks`).then((response) => {
    //   setBanks(response.data.data);
    // });
    await axios.get(`${app.api}/banks`).then((response) => {
      setBanks(response.data.data);
    });

    await axios.get(`${app.api}/tran_types`).then((response) => {
      setTranType(response.data);
    });

    await axios.get(`${app.api}/merchants`).then((response) => {
      setMerchant(response.data.data);
    });

    await axios.post(`${app.api}/codes`).then((response) => {
      setRespCode(response.data.data);
    });
  }, []);

  return (
    <Formik
      initialValues={{
        tranId: "",
        tranTypeId: [],
        amountFrom: "",
        amountTo: "",
        pan1: "",
        pan2: "",
        dateStart: new Date().toISOString().slice(0, 16),
        dateEnd: "",
        merchantId: [],
        gatewayId: [],
        respCodeId: [],
        bankId: [],
        fields: [],
      }}
      validationSchema={Yup.object().shape({
        // tranId: Yup.string().max(255),
        // //email: Yup.string().email(t("email")).max(255).required(t("required")),
        // tranTypeId: Yup.string().max(255),
        // amount: Yup.string().max(255),
        // merchantId: Yup.string().max(255),
        // dateStart: Yup.string().max(255),
        // dateEnd: Yup.string().max(255),
        // gatewayId: Yup.string().max(255),
        pan1: Yup.string().min(6).max(6),
        pan2: Yup.string().min(4).max(4),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await props.callback({
            ...values,
            dateStart: formatDate(values.dateStart),
            dateEnd: formatDate(values.dateEnd),
          });

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
        setFieldValue,
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
                  error={Boolean(touched.dateStart && errors.dateStart)}
                  fullWidth
                  helperText={touched.dateStart && errors.dateStart}
                  label={t("createOn")}
                  margin="normal"
                  name="dateStart"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="datetime-local"
                  value={values.dateStart}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  autoFocus
                  error={Boolean(touched.dateEnd && errors.dateEnd)}
                  fullWidth
                  helperText={touched.dateEnd && errors.dateEnd}
                  label={t("dateEnd")}
                  margin="normal"
                  name="dateEnd"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="date"
                  value={values.dateEnd}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <Select
                  error={Boolean(touched.tranTypeId && errors.tranTypeId)}
                  fullWidth
                  select
                  helperText={touched.tranTypeId && errors.tranTypeId}
                  label={t("tranTypeId")}
                  margin="normal"
                  name="tranTypeId"
                  onBlur={handleBlur}
                  type="text"
                  value={values.tranTypeId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue("tranTypeId", e.target.value);
                  }}
                  multiple
                >
                  {tranType.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={3}>
                <Select
                  error={Boolean(touched.merchantId && errors.merchantId)}
                  fullWidth
                  select
                  helperText={touched.merchantId && errors.merchantId}
                  label={t("merchantId")}
                  margin="normal"
                  name="merchantId"
                  onBlur={handleBlur}
                  type="text"
                  value={values.merchantId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue("merchantId", e.target.value);
                  }}
                  multiple
                >
                  <MenuItem key={-1} value={""}>
                    {t("Select value")}
                  </MenuItem>
                  {merchant.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={3}>
                <Select
                  error={Boolean(touched.bankId && errors.bankId)}
                  fullWidth
                  select
                  helperText={touched.bankId && errors.bankId}
                  label="bankId"
                  name="bankId"
                  onBlur={handleBlur}
                  size="small"
                  value={values.bankId}
                  variant="outlined"
                  onChange={(e) => {
                    setFieldValue("bankId", e.target.value);
                  }}
                  multiple
                >
                  {banks.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={3}>
                {/*<InputLabel id="respCodeId">respCodeId</InputLabel>*/}
                <Select
                  error={Boolean(touched.respCodeId && errors.respCodeId)}
                  labelId="respCodeId"
                  fullWidth
                  select
                  helperText={touched.respCodeId && errors.respCodeId}
                  label={t("respCodeId")}
                  margin="normal"
                  name="respCode"
                  onBlur={handleBlur}
                  value={values.respCodeId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue("respCodeId", e.target.value);
                  }}
                  multiple
                >
                  {respCode.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.langEn}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.amountFrom && errors.amountFrom)}
                  fullWidth
                  helperText={touched.amountFrom && errors.amountFrom}
                  label={t("amountFrom")}
                  margin="normal"
                  name="amountFrom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.amountFrom}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.amountTo && errors.amountTo)}
                  fullWidth
                  helperText={touched.amountTo && errors.amountTo}
                  label={t("amountTo")}
                  margin="normal"
                  name="amountTo"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.amountTo}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.pan1 && errors.pan1)}
                  fullWidth
                  helperText={touched.pan1 && errors.pan1}
                  label={t("card first 6 number")}
                  margin="normal"
                  name="pan1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.pan1}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  error={Boolean(touched.pan2 && errors.pan2)}
                  fullWidth
                  helperText={touched.pan2 && errors.pan2}
                  label={t("card last 4 number")}
                  margin="normal"
                  name="pan2"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.pan2}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  autoFocus
                  error={Boolean(touched.tranId && errors.tranId)}
                  fullWidth
                  helperText={touched.tranId && errors.tranId}
                  label={t("tranId")}
                  margin="normal"
                  name="tranId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.tranId}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                {/*<InputLabel id="respCodeId">respCodeId</InputLabel>*/}
                <Select
                  error={Boolean(touched.fields && errors.fields)}
                  labelId="respCodeId"
                  fullWidth
                  select
                  helperText={touched.fields && errors.fields}
                  label={t("fields")}
                  margin="normal"
                  name="fields"
                  onBlur={handleBlur}
                  value={values.fields}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                  onChange={(e) => {
                    setFieldValue("fields", e.target.value);
                  }}
                  multiple
                >
                  {fields.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="small"
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

export default ExportFileFilter;
