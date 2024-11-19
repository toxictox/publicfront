import { BackButton } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Grid,
  TextField
} from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';
import { createCompany, updateCompany } from '../helper';

const HandbookCreateAndUpdate = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const companyData = useMemo(
    () =>
      location.state?.item || {
        name: '',
        iin: '',
        bik: '',
        bankAccount: '',
        bankName: ''
      },
    [location.state]
  );

  const initialValues = useMemo(
    () => ({
      name: companyData.name,
      iin: companyData.iin,
      bik: companyData.bik,
      bankAccount: companyData.bankAccount,
      bankName: companyData.bankName
    }),
    [companyData]
  );
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, t('nameFormat'))
      .max(100, t('nameFormat'))
      .required(t('required')),
    iin: Yup.string()
      .matches(/^\d{12}$/, t('iinError'))
      .required(t('required')),
    bik: Yup.string().required(t('required')),
    bankAccount: Yup.string()
      .matches(/^[KZ]{2}[A-Z0-9]{18}$/, t('invalidBankAccountFormat'))
      .required(t('required')),
    bankName: Yup.string()
  });

  const handleSubmit = async (values) => {
    if (companyData.id) {
      try {
        const response = await updateCompany(companyData.id, values);
        if (response.id) {
          toast.success(t('Successfully updated'));
          navigate('/transit-account/handbookCompanies');
        }
      } catch (error) {
        toast.error('Error');
      }
    } else {
      try {
        const response = await createCompany(values);
        if (response.id) {
          toast.success(t('Successfully created'));
          navigate('/transit-account/handbookCompanies');
        }
      } catch (error) {
        toast.error('Error');
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/transit-account/handbookCompanies');
    }
  }, [isAuthenticated, navigate]);

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
          <BackButton
            action={() => navigate(`/transit-account/handbookCompanies`)}
          />

          <Card sx={{ mt: 2, p: 3 }}>
            <CardHeader
              title={t(companyData?.id ? 'Update Company' : 'Create Company')}
            />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Grid container spacing={3}>
                    {['name', 'iin', 'bik', 'bankAccount', 'bankName'].map(
                      (field) => (
                        <Grid item xs={12} key={field}>
                          <Field
                            as={TextField}
                            fullWidth
                            label={t(field)}
                            name={field}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[field]}
                            error={touched[field] && Boolean(errors[field])}
                            helperText={touched[field] && errors[field]}
                          />
                        </Grid>
                      )
                    )}
                    <Grid item xs={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        {t(companyData?.id ? 'Update button' : 'Create button')}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
      </Box>
    </>
  );
};
export default HandbookCreateAndUpdate;
