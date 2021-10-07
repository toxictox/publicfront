import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  FormControl,
  FormLabel,
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

const CreateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const [listPermission, setListPermission] = useState([]);

  useEffect(async () => {
    const response = await axios
      .get(`${app.api}/permission/list`)
      .then((response) => response.data);

    if (mounted.current) {
      setListPermission(response);
    }
  }, []);

  return (
    <Formik
      initialValues={{
        name: "",
        // permissions: [],
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required(t("required")).nullable(),
        // permissions: Yup.array().required(t("required")).nullable(),
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
                                      control={
                                        <Checkbox
                                          fullWidth
                                          name={"permissions"}
                                          color="primary"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                        />
                                      }
                                      label={child.name}
                                      labelPlacement="end"
                                    />
                                  ))}

                                  {/*<FormControlLabel*/}
                                  {/*  name={"permissions"}*/}
                                  {/*  value="2"*/}
                                  {/*  control={*/}
                                  {/*    <Checkbox*/}
                                  {/*      fullWidth*/}
                                  {/*      name={"permissions"}*/}
                                  {/*      color="primary"*/}
                                  {/*      onBlur={handleBlur}*/}
                                  {/*      onChange={handleChange}*/}
                                  {/*    />*/}
                                  {/*  }*/}
                                  {/*  label="End"*/}
                                  {/*  labelPlacement="end"*/}
                                  {/*/>*/}
                                </FormGroup>
                              </FormControl>
                            ),
                          };
                        })
                      : null
                  }
                  // data={[
                  //   {
                  //     title: "dasdasd",
                  //     content: "asss",
                  //   },
                  //   {
                  //     title: "dasdasd2",
                  //     content: (
                  //       <FormControl component="fieldset">
                  //         <FormLabel component="legend">
                  //           Label Placement
                  //         </FormLabel>
                  //         <FormGroup aria-label="position" row>
                  //           <FormControlLabel
                  //             name={"permissions"}
                  //             value="1"
                  //             control={
                  //               <Checkbox
                  //                 fullWidth
                  //                 name={"permissions"}
                  //                 color="primary"
                  //                 onBlur={handleBlur}
                  //                 onChange={handleChange}
                  //               />
                  //             }
                  //             label="End"
                  //             labelPlacement="end"
                  //           />
                  //
                  //           <FormControlLabel
                  //             name={"permissions"}
                  //             value="2"
                  //             control={
                  //               <Checkbox
                  //                 fullWidth
                  //                 name={"permissions"}
                  //                 color="primary"
                  //                 onBlur={handleBlur}
                  //                 onChange={handleChange}
                  //               />
                  //             }
                  //             label="End"
                  //             labelPlacement="end"
                  //           />
                  //         </FormGroup>
                  //       </FormControl>
                  //     ),
                  //   },
                  //   {
                  //     title: "dasdasd3",
                  //     content: "asss3",
                  //   },
                  // ]}
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

export default CreateForm;
