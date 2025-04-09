import { BackButton } from '@comp/core/buttons';
import useAuth from '@hooks/useAuth';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Switch,
  TextField
} from '@material-ui/core';
import { format } from 'date-fns';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';
import { createMaintenance, formatDate, updateMaintenance } from './helper';

const CreateUpdateMaintenance = () => {
  const settings = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const item = location.state?.item;

  const initialValues = {
    ...(item?.id ? { id: item.id } : {}),
    startDate: formatDate(item?.startDate),
    endDate: formatDate(item?.endDate),
    filteredByMerchant: item?.filteredByMerchant || false,
    merchants: item?.merchants || []
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.string().required(t('required')),
    endDate: Yup.string().required(t('required')),
    filteredByMerchant: Yup.boolean(),
    merchants: Yup.array()
      .of(Yup.number())
      .required(t('At least one merchant is required'))
  });

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        startDate: format(new Date(values.startDate), 'dd.MM.yyyy HH:mm'),
        endDate: format(new Date(values.endDate), 'dd.MM.yyyy HH:mm')
      };
      item?.id
        ? await updateMaintenance(formattedValues, item?.id)
        : await createMaintenance(formattedValues);

      toast.success(t('Success'));
      navigate('/maintenance');
    } catch (error) {
      toast.error(t('Error!'));
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <BackButton action={() => navigate(`/maintenance`)} />
          <Box sx={{ mt: 1 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={
                  item?.id ? t('Maintenance Update') : t('Maintenance Create')
                }
              />
              <Divider />
              <Box sx={{ p: 2 }}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    setFieldValue,
                    handleBlur
                  }) => (
                    <Form>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <TextField
                            autoFocus
                            error={Boolean(
                              touched.startDate && errors.startDate
                            )}
                            fullWidth
                            helperText={touched.startDate && errors.startDate}
                            label={t('dateStart')}
                            margin="normal"
                            name="startDate"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="datetime-local"
                            value={values.startDate}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.endDate && errors.endDate)}
                            fullWidth
                            helperText={touched.endDate && errors.endDate}
                            label={t('dateEnd')}
                            margin="normal"
                            name="endDate"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="datetime-local"
                            value={values.endDate}
                            variant="outlined"
                            size="small"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth>
                          <InputLabel>{t('merchants')}</InputLabel>
                          <Select
                            multiple
                            value={values.merchants}
                            onChange={(e) =>
                              setFieldValue('merchants', e.target.value)
                            }
                            renderValue={(selected) =>
                              selected
                                .map(
                                  (id) =>
                                    user.merchants.find(
                                      (merchant) => merchant.merchantId === id
                                    )?.merchantName
                                )
                                .join(', ')
                            }
                          >
                            {user.merchants.map((merchant) => (
                              <MenuItem
                                key={merchant.merchantId}
                                value={merchant.merchantId}
                              >
                                <Checkbox
                                  checked={values.merchants.includes(
                                    merchant.merchantId
                                  )}
                                />
                                <ListItemText primary={merchant.merchantName} />
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.merchants && errors.merchants && (
                            <Box sx={{ color: 'error.main', mt: 1 }}>
                              {errors.merchants}
                            </Box>
                          )}
                        </FormControl>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              name="filteredByMerchant"
                              checked={values.filteredByMerchant}
                              onChange={(e) =>
                                setFieldValue(
                                  'filteredByMerchant',
                                  e.target.checked
                                )
                              }
                              color={
                                values.filteredByMerchant ? 'success' : 'error'
                              }
                            />
                          }
                          label={
                            values.filteredByMerchant
                              ? t('Merchants filter enabled')
                              : t('Merchants filter disabled')
                          }
                        />
                      </Box>
                      <Button type="submit" variant="contained" color="primary">
                        {values.id ? t('Update') : t('Create')}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CreateUpdateMaintenance;
