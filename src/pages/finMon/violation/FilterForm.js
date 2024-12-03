import { Autocomplete, Button, Grid, TextField } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';

const FilterForm = ({ initialValues, handleFilterSubmit, merchants }) => {
  const { t } = useTranslation();

  return (
    <Formik initialValues={initialValues} onSubmit={handleFilterSubmit}>
      {({ handleSubmit, setFieldValue, getFieldProps, values }) => (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                multiple
                options={merchants || []}
                getOptionLabel={(option) => option.merchantName}
                onChange={(event, value) =>
                  setFieldValue(
                    'merchantIds',
                    value.map((item) => item.merchantId)
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={t('merchant')}
                    size="small"
                  />
                )}
                value={merchants.filter((merchant) =>
                  values.merchantIds.includes(merchant.merchantId)
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                {...getFieldProps('tranId')}
                label={t('tranId')}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                {...getFieldProps('dateFrom')}
                label={t('startDate')}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                {...getFieldProps('dateTo')}
                label={t('endDate')}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                {t('Apply button')}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default FilterForm;
