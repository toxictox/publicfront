import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  FormHelperText,
  TextField,
  Button,
  Grid, Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { Edit } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { showConfirm } from "@slices/dialog";
import DynamicFieldsSet from "@comp/form/DynamicFieldsSet";

const UpdateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [privateKey, setPrivateKey] = useState(true);

  return (
    <Formik
      initialValues={{
        options: typeof data.settings === 'object' && data.settings !== null && !Array.isArray(data.settings)
            ? data.settings
            : {}
      }}
      enableReinitialize={true}
      validationSchema={Yup.object().shape({})}
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
        setFieldValue
      }) => (
        <form noValidate onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DynamicFieldsSet
                    onChange={(e) => {
                      const name = e.target.name;
                      const value = e.target.value;

                      if (name.startsWith('options.')) {
                        const fieldKey = name.split('.')[1];
                        setFieldValue(`options.${fieldKey}`, value);
                      } else {
                        handleChange(e);
                      }
                    }}
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

export default UpdateForm;
