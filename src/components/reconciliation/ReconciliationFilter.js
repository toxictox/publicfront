import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  MenuItem,
  FormHelperText,
  TextField,
  Grid,
  Input,
  Button,
  Stack,
  CircularProgress,
} from "@material-ui/core";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";
import toast from "react-hot-toast";

const TransactionFilter = (props) => {
  const { t } = useTranslation();
  const { callback, update } = props;
  const [banksList, setBanksList] = useState([]);
  const [file, setFile] = useState(true);

  useEffect(async () => {
    await axios
      .get(`${app.api}/filter/banks`)
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
        const formData = new FormData();
        formData.append("file", values.file, values.file.name);
        formData.append("bankId", values.bankId);
        await axios
          .post(`${app.api}/reconciliation/file`, formData)
          .then((response) => {
            setFile(true);
            update(response.data);
            toast.success(t("Success upload"));
          })
          .catch((e) => {
            setFile(true);
            toast.error(e.response.data.message);
          });
      }}
    >
      {({
        errors,
        handleBlur,
        handleSubmit,
        setFieldValue,
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
              <Grid item xs={6}>
                {values.bankId !== "" ? (
                  <Stack direction="row" spacing={2}>
                    <label htmlFor="contained-button-file">
                      {file ? (
                        <>
                          <Input
                            // accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            id="contained-button-file"
                            name={"file"}
                            multiple
                            type="file"
                            onChange={(e) => {
                              setFieldValue("file", e.currentTarget.files[0]);
                              handleSubmit();
                              setFile(false);
                            }}
                            sx={{ display: "none" }}
                          />
                          <Button variant="contained" component="span">
                            {t("Upload file")}
                          </Button>
                        </>
                      ) : (
                        <Button variant="contained" disabled={true}>
                          {t("Loading")}
                          {"   "}
                          <CircularProgress color="inherit" size={20} />
                        </Button>
                      )}
                    </label>
                  </Stack>
                ) : null}
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
