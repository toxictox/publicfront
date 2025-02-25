import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  TextField,
  MenuItem,
  Grid,
} from '@material-ui/core';
import useMounted from '@hooks/useMounted';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import axios from '@lib/axios';
import { app } from '@root/config';

const CreateModelForm = (props) => {
  const mounted = useMounted();
  const { callback } = props;
  const [condition, setCondition] = useState(null);
  const [conditionData, setConditionData] = useState([]);
  const [gateway, setGateway] = useState([]);
  const [gatewayMethod, setGatewayMethod] = useState([]);
  const [rules, setRules] = useState([]);
  const { t } = useTranslation();
  const { state } = useLocation();

  useEffect(() => {
    const getData = async () => {
      await axios.get(`${app.api}/gateways?count=100`).then((response) => {
        setGateway(response.data.data);
      });

      await axios.get(`${app.api}/cascade/rules`).then((response) => {
        setRules(response.data.data);
      });
    };
    getData();
  }, []);

  const addCondition = (e) => {
    setConditionData([
      ...conditionData,
      {
        hash: Date.now(),
        ruleCond: '',
        ruleValue: '',
      },
    ]);
  };

  const removeCondition = (id) => {
    setConditionData([...conditionData.filter((item) => item.hash !== id)]);
  };

  const handleChangeRules = (e, id) => {
    setConditionData([
      ...conditionData.map((item) => {
        if (item.hash === id) {
          item[e.target.name] = e.target.value;
        }

        return item;
      }),
    ]);
  };

  const getGatewayMethods = async (id) => {
    if (id !== '' && id !== 0 && id !== undefined) {
      await axios.get(`${app.api}/methods/gateway/${id}`).then((response) => {
        setGatewayMethod(response.data);
      });
    } else {
      setGatewayMethod([]);
    }
  };

  const handleChangeRule = async (e, set) => {
    set(e.target.name, e.target.value);
    let flag = null;
    for (let i = 0; i < rules.length; i++) {
      if (rules[i].id === e.target.value) {
        flag = rules[i].condition;
        break;
      }
    }
    if (flag) {
      setCondition(flag);
      setConditionData([
        {
          hash: Date.now(),
          ruleCond: '',
          ruleValue: '',
        },
      ]);
    } else {
      setCondition(null);
      setConditionData([]);
    }
  };

  return (
    <Formik
      initialValues={{
        gatewayId: '',
        ruleId: '',
        gatewayMethodId: '',
        merchantId: state.merchantId,
        tranTypeId: state.tranTypesId,
      }}
      validationSchema={Yup.object().shape({
        gatewayId: Yup.string().max(5).required(t('required')),
        ruleId: Yup.string().max(5).nullable(),
        gatewayMethodId: Yup.string().max(5).required(t('required')),
        // ---------------------
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await callback({ ...values, ruleCondition: conditionData });

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
        setFieldValue,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit} {...props}>
          <Box m={2}>
            <Grid container spacing={2}>
              {values.tranTypeId !== '' ? (
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.gatewayId && errors.gatewayId)}
                    fullWidth
                    helperText={touched.gatewayId && errors.gatewayId}
                    label={t('gatewayId')}
                    name="gatewayId"
                    onChange={(e) => {
                      setFieldValue('gatewayId', e.target.value);
                      getGatewayMethods(e.target.value);
                    }}
                    onBlur={handleBlur}
                    select
                    size="small"
                    value={values.gatewayId}
                    variant="outlined"
                  >
                    <MenuItem key={-1} value={''}>
                      {t('Select value')}
                    </MenuItem>
                    {gateway.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : null}

              {values.gatewayId !== '' ? (
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(
                      touched.gatewayMethodId && errors.gatewayMethodId
                    )}
                    fullWidth
                    helperText={
                      touched.gatewayMethodId && errors.gatewayMethodId
                    }
                    label="gatewayMethodId"
                    name="gatewayMethodId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    select
                    size="small"
                    value={values.gatewayMethodId}
                    variant="outlined"
                  >
                    <MenuItem key={-1} value={''}>
                      {t('Select value')}
                    </MenuItem>
                    {gatewayMethod.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : null}

              {values.gatewayMethodId !== '' ? (
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(touched.ruleId && errors.ruleId)}
                    fullWidth
                    helperText={touched.ruleId && errors.ruleId}
                    label="ruleId"
                    name="ruleId"
                    onChange={(e) => handleChangeRule(e, setFieldValue)}
                    onBlur={handleBlur}
                    select
                    size="small"
                    value={values.ruleId}
                    variant="outlined"
                  >
                    <MenuItem key={-1} value={''}>
                      {t('Select value')}
                    </MenuItem>
                    {rules.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : null}

              {condition ? (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        onClick={addCondition}
                      >
                        +
                      </Button>
                    </Grid>
                  </Grid>

                  {conditionData.length
                    ? conditionData.map((item) => (
                        <Grid
                          container
                          key={item.hash}
                          spacing={2}
                          sx={{ mt: 2 }}
                        >
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              label={t('ruleCond')}
                              margin="normal"
                              name={`ruleCond`}
                              onChange={(e) => handleChangeRules(e, item.hash)}
                              select
                              variant="outlined"
                              value={item.ruleCond}
                              size="small"
                              sx={{ m: 0 }}
                            >
                              {Object.keys(condition).map((name, i) => (
                                <MenuItem value={name} key={name}>
                                  {condition[name]}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={6}>
                            <TextField
                              autoFocus
                              error={Boolean(touched.item && errors.item)}
                              fullWidth
                              helperText={touched.item && errors.item}
                              label={t('ruleValue')}
                              margin="normal"
                              value={item.ruleValue}
                              name={`ruleValue`}
                              onBlur={handleBlur}
                              onChange={(e) => handleChangeRules(e, item.hash)}
                              type="text"
                              variant="outlined"
                              size="small"
                              sx={{ m: 0 }}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <Button
                              color="secondary"
                              variant="contained"
                              size="large"
                              onClick={() => removeCondition(item.hash)}
                            >
                              -
                            </Button>
                          </Grid>
                        </Grid>
                      ))
                    : null}
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    size="large"
                  >
                    {t('Create button')}
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

export default CreateModelForm;
