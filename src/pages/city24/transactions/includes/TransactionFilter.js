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
import { useEffect, useState } from "react";
import axios from "@lib/axios";

import { app } from "@root/config";
import { GetFilterDataFromStore } from "@lib/filter";
import { SelectCheckbox, SelectCheckboxCodes } from "@comp/core/forms";

const TransactionFilter = (props) => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const [respCode, setRespCode] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/filter/codes`).then((response) => {
        setRespCode(response.data.data);
      });
    };
    getData();
  }, []);

  const dataForFields =
    GetFilterDataFromStore("transactions") !== undefined
      ? GetFilterDataFromStore("transactions")
      : {
          respCode: [],
          bankId: [],
        };
  return (
    <Formik
      initialValues={dataForFields}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({
        tranId: Yup.string().max(255),
        tranTypeId: Yup.array(),
        dateStart: Yup.string().max(255),
        dateEnd: Yup.string().max(255),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await props.callback({
            ...values,
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
                  type="datetime-local"
                  value={values.dateEnd}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ m: 0 }}
                />
              </Grid>

              <Grid item xs={6}>
                <SelectCheckboxCodes
                  error={Boolean(touched.respCode && errors.respCode)}
                  labelId="respCode"
                  helperText={touched.respCode && errors.respCode}
                  label={t("respCode")}
                  name="respCode"
                  onBlur={handleBlur}
                  value={values.respCode !== undefined ? values.respCode : []}
                  sx={{ m: 0 }}
                  onChange={(data) => {
                    setFieldValue("respCode", data);
                  }}
                  fieldText={["external", "langEn"]}
                  items={respCode}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
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
                <Box sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="small"
                  >
                    {t("Search button")}
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

export default TransactionFilter;
