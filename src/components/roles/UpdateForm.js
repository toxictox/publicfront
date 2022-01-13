import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Grid,
} from "@material-ui/core";
import { SimpleAccordion } from "@comp/core/accodrion";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import axios from "@lib/axios";
import { app } from "@root/config";
import useAuth from "@hooks/useAuth";

const CreateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [listPermission, setListPermission] = useState([]);
  const [checked, setChecked] = useState(data.permissions);

  useEffect(() => {
    const getData = async () => {
      const response = await axios
        .get(`${app.api}/permission/list`)
        .then((response) => response.data);

      if (mounted.current) {
        setListPermission(response);
      }
    };
    getData();
  }, [mounted]);

  const handleChangeCheckbox = (val) => {
    let copy = checked.slice(0);
    if (copy.includes(+val)) {
      copy.splice(copy.indexOf(+val), 1);
    } else {
      copy.push(+val);
    }
    setChecked(copy);
  };

  return (
    <Formik
      initialValues={{
        name: data.roleName,
        //permissions: data.permissions,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required(t("required")).nullable(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback({
            name: values.name,
            permissions: checked,
            merchantId: data.merchantId,
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
                  value={values.name}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <SimpleAccordion
                  data={
                    listPermission !== undefined && listPermission.length > 0
                      ? listPermission.map((item, i) => {
                          return {
                            title: item.category,
                            content: (
                              <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                  {item.permission.map((child) => (
                                    <FormControlLabel
                                      name={"permissions"}
                                      key={child.id}
                                      value={child.id}
                                      checked={checked.includes(child.id)}
                                      control={
                                        <Checkbox
                                          fullWidth
                                          name={"permissions"}
                                          color="primary"
                                          onBlur={handleBlur}
                                          onChange={(e) =>
                                            handleChangeCheckbox(e.target.value)
                                          }
                                        />
                                      }
                                      label={child.name}
                                      labelPlacement="end"
                                    />
                                  ))}
                                </FormGroup>
                              </FormControl>
                            ),
                          };
                        })
                      : null
                  }
                />
              </Grid>

              {getAccess("roles", "update") ? (
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                      size="large"
                    >
                      {t("update button")}
                    </Button>
                  </Box>
                </Grid>
              ) : null}
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

export default CreateForm;
