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
import { useParams } from "react-router-dom";

const CreateForm = (props) => {
  const mounted = useMounted();
  const { data, callback } = props;
  const { t } = useTranslation();
  const { id } = useParams();
  const [listPermission, setListPermission] = useState([]);
  const [checked, setChecked] = useState([]);
  const auth = useAuth();

  useEffect(async () => {
    const responseList = await axios
      .post(`${app.api}/user/get/roles`, {
        hash: auth.user.hash,
      })
      .then((response) => response.data);

    const responseChecked = await axios
      .post(`${app.api}/user/active/roles`, {
        hash: id,
      })
      .then((response) => response.data);

    if (mounted.current) {
      setChecked(responseChecked.roles);
      setListPermission(responseList);
    }
  }, []);

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
      initialValues={
        {
          //permissions: data.permissions,
        }
      }
      validationSchema={Yup.object().shape({
        // permissions: Yup.string().max(255).required(t("required")).nullable(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback({
            hash: id,
            roles: checked,
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
                                      checked={checked.includes(child.roleId)}
                                      control={
                                        <Checkbox
                                          fullWidth
                                          name={"roles"}
                                          color="primary"
                                          onBlur={handleBlur}
                                          onChange={(e) =>
                                            handleChangeCheckbox(e.target.value)
                                          }
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

export default CreateForm;
