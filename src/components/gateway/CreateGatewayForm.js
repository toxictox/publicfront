import { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  MenuItem,
  Select,
  Grid,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import axios from "@lib/axios";
import { app } from "@root/config";
import toast from "react-hot-toast";

const CreateGatewayForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const [banks, setBanks] = useState([]);
  const { t } = useTranslation();

  useEffect(async () => {
    await axios.get(`${app.api}/banks`).then((response) => {
      setBanks(response.data.data);
    });
  }, []);
  return (
    <Formik
      initialValues={{
        name: "",
        endpoint: "",
        env: "",
        bank: "",
        bankId: "",
        // depositLimit: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required(t("required")),
        endpoint: Yup.string().max(255).required(t("required")),
        env: Yup.string().max(255).required(t("required")),
        bank: Yup.string().max(255).required(t("required")),
        bankId: Yup.number().required(t("required")),
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
                  label={t("name gateway field")}
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
                  autoFocus
                  error={Boolean(touched.endpoint && errors.endpoint)}
                  fullWidth
                  helperText={touched.name && errors.endpoint}
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
                  autoFocus
                  error={Boolean(touched.env && errors.env)}
                  fullWidth
                  helperText={touched.env && errors.env}
                  label={t("env")}
                  margin="normal"
                  name="env"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.env}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoFocus
                  error={Boolean(touched.bank && errors.bank)}
                  fullWidth
                  helperText={touched.bank && errors.bank}
                  label={t("bank")}
                  margin="normal"
                  name="bank"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.bank}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Select
                  labelId="demo-customized-select-label"
                  id="demo-customized-select"
                  label="Age"
                  name="bankId"
                  value={values.bankId}
                  size="small"
                  onChange={handleChange}
                  fullWidth
                  sx={{ m: 0 }}
                >
                  <MenuItem value="">None</MenuItem>
                  {banks.map((item) => (
                    <MenuItem value={item.id} key={item.id}>
                      {item.name}
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

export default CreateGatewayForm;
