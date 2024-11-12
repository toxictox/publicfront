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
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  iin: Yup.string().required('IIN is required'),
  bik: Yup.string().required('BIK is required'),
  bankAccount: Yup.string().required('Bank Account is required'),
  bankName: Yup.string().required('Bank Name is required')
});

const HandbookCreateAndUpdate = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const companyData = location.state?.item || {
    name: '',
    iin: '',
    bik: '',
    bankAccount: '',
    bankName: ''
  };

  const initialValues = {
    name: companyData.name,
    iin: companyData.iin,
    bik: companyData.bik,
    bankAccount: companyData.bankAccount,
    bankName: companyData.bankName
  };

  const handleSubmit = (values) => {
    if (companyData.id) {
      //   редактирование
      console.log('Editing company with values:', values);
    } else {
      //  это создание
      console.log('Creating new company with values:', values);
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
          <BackButton
            action={() => navigate(`/transit-account/handbookCompanies`)}
          />

          <Card sx={{ mt: 2, p: 3 }}>
            <CardHeader
              title={companyData?.id ? t('Update Company') : t('Create Company')}
            />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleChange, handleBlur, values }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Name"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="IIN"
                        name="iin"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.iin}
                        error={touched.iin && Boolean(errors.iin)}
                        helperText={touched.iin && errors.iin}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="BIK"
                        name="bik"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.bik}
                        error={touched.bik && Boolean(errors.bik)}
                        helperText={touched.bik && errors.bik}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Bank Account"
                        name="bankAccount"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.bankAccount}
                        error={
                          touched.bankAccount && Boolean(errors.bankAccount)
                        }
                        helperText={touched.bankAccount && errors.bankAccount}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Bank Name"
                        name="bankName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.bankName}
                        error={touched.bankName && Boolean(errors.bankName)}
                        helperText={touched.bankName && errors.bankName}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        {companyData.id
                          ? t('Update button')
                          : t('Create button')}
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
