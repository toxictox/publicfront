import { BackButton } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';
import { createTransaction, getAllCompaniesTransactions } from '../helper';

const CreateTransactions = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [accountOptions, setAccountOptions] = useState([]);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  const { accounts } = location.state || {};

  const validationSchema = Yup.object({
    account: Yup.string().required(t('required')),
    targetAccount: Yup.string().required(t('required')),
    iin: Yup.string().required(t('required')),
    bik: Yup.string().required(t('required')),
    narrative: Yup.string().required(t('required')),
    amount: Yup.number().required(t('required'))
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await getAllCompaniesTransactions();
      setCompanies(data.items);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/transit-account/transitTransactions');
    } else {
      fetchCompanies();
    }
  }, [fetchCompanies, isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedCompany) {
      const selected = companies.find(
        (company) => company.id === selectedCompany
      );
      if (selected) {
        formik.setFieldValue('iin', selected.iin);
        formik.setFieldValue('bik', selected.bik);
        formik.setFieldValue('targetAccount', selected.bankAccount);
      }
    }
    if (accounts?.items) {
      setAccountOptions(accounts.items);
    }
  }, [selectedCompany, companies, accounts]);

  const formik = useFormik({
    initialValues: {
      account: '',
      targetAccount: '',
      iin: '',
      bik: '',
      narrative: '',
      amount: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const amount = parseFloat(values.amount);
      const updatedValues = { ...values, amount };
      try {
        await createTransaction(updatedValues);
        toast.success('Successfully created');
        navigate('/transit-account/transitTransactions');
      } catch (error) {
        toast.error('Error!');
      }
      console.log(updatedValues);
    }
  });

  const renderField = (name, label) => (
    <TextField
      fullWidth
      label={t(label)}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      sx={{ mt: 2 }}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
    />
  );

  return (
    <Box
      sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 2 }}
    >
      <Container maxWidth={settings.compact ? 'xl' : false}>
        <BackButton
          action={() => navigate(`/transit-account/transitTransactions`)}
        />
        <Card sx={{ mt: 2, p: 3 }}>
          <CardHeader title={t('Create Transactions')} />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t('Select Company')}</InputLabel>
            <Select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              label={t('Select Company')}
            >
              {companies?.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t('Select Account')}</InputLabel>
              <Select
                value={formik.values.account}
                onChange={formik.handleChange}
                inputProps={{ name: 'account' }}
                error={formik.touched.account && Boolean(formik.errors.account)}
              >
                {accountOptions.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    <ListItemText primary={account.name} />
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.account && formik.errors.account && (
                <Box color="error.main" sx={{ mt: 1 }}>
                  {formik.errors.account}
                </Box>
              )}
            </FormControl>

            {renderField('targetAccount', 'targetAccount')}
            {renderField('iin', 'iin')}
            {renderField('bik', 'bik')}
            {renderField('narrative', 'narrative')}
            {renderField('amount', 'Amount')}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              {t('Create button')}
            </Button>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default CreateTransactions;
