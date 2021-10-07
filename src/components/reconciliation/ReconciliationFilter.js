import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  MenuItem,
  FormHelperText,
  TextField,
  Grid,
} from "@material-ui/core";
import useAuth from "@hooks/useAuth";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";

const TransactionFilter = (props) => {
  const mounted = useMounted();
  const { login } = useAuth();
  const { t } = useTranslation();
  const { callback } = props;
  const [banksList, setBanksList] = useState([]);

  useEffect(async () => {
    await axios
      .get(`${app.api}/banks?page=0&count=${25}`)
      .then((response) => {
        setBanksList(response.data.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <Formik
      initialValues={{
        bankId: "",
      }}
      validationSchema={Yup.object().shape({
        bankId: Yup.string().max(255),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await props.callback(values);

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
                  error={Boolean(touched.bankId && errors.bankId)}
                  fullWidth
                  select
                  helperText={touched.bankId && errors.bankId}
                  label={t("bankId")}
                  margin="normal"
                  name="bankId"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue("bankId", e.target.value);
                    callback(e.target.value);
                  }}
                  value={values.bankId}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                >
                  <MenuItem key={-1} value={""}>
                    {t("Select value")}
                  </MenuItem>
                  {banksList.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
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

export default TransactionFilter;
