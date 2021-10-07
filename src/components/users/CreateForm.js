import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import { useTranslation } from "react-i18next";
import { SimpleAccordion } from "@comp/core/accodrion";
import { useEffect, useState } from "react";
import axios from "@lib/axios";
import { app } from "@root/config";
import useAuth from "@hooks/useAuth";
const UpdateForm = (props) => {
  const mounted = useMounted();
  const auth = useAuth();
  const { data, callback } = props;
  const { t } = useTranslation();
  const [listPermission, setListPermission] = useState([]);

  useEffect(async () => {
    const response = await axios
      .post(`${app.api}/user/get/roles`, {
        hash: auth.user.hash,
      })
      .then((response) => response.data);

    if (mounted.current) {
      setListPermission(response);
    }
  }, []);

  // const handleChangeCheckbox = (val) => {
  //   let copy = checked.slice(0);
  //   if (copy.includes(+val)) {
  //     copy.splice(copy.indexOf(+val), 1);
  //   } else {
  //     copy.push(+val);
  //   }
  //   setChecked(copy);
  // };

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email().max(255).required(t("required")),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback({ ...values, ownerId: 1 });

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
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label={t("email filed")}
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
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
                            title: item.name,

                            content: (
                              <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                  {item.roles.map((child) => (
                                    <FormControlLabel
                                      name={"roles"}
                                      key={child.roleId}
                                      value={child.roleId}
                                      control={
                                        <Checkbox
                                          fullWidth
                                          name={"roles"}
                                          color="primary"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          // onChange={(e) =>
                                          //   handleChangeCheckbox(e.target.value)
                                          // }
                                        />
                                      }
                                      label={child.roleName}
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
