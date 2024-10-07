import { SelectCheckbox } from '@comp/core/forms';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { getResults, initialValues } from '../helper';

const FilterDialog = ({
  open,
  onClose,
  banks,
  merchants,
  statuses,
  types,
  setFilterData,
  page,
  count,
  onFilterResults,
  pageNumber
}) => {
  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    try {
      const response = await getResults(
        page + 1,
        count,
        values.resolved,
        values.startDate,
        values.endDate,
        values.merchants,
        values.bankId,
        values.statuses,
        values.jobs,
        pageNumber
      );
      setFilterData(values)
      onFilterResults(response);
      onClose();
    } catch (error) {}
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('Filter')}</DialogTitle>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({
          values,
          handleChange,
          setFieldValue,
          errors,
          touched,
          handleBlur
        }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <SelectCheckbox
                    error={Boolean(touched.bankId && errors.bankId)}
                    labelId="bankId"
                    helperText={touched.bankId && errors.bankId}
                    label={t('bankId')}
                    name="bankId"
                    onBlur={handleBlur}
                    value={values.bankId !== undefined ? values.bankId : []}
                    sx={{ m: 0 }}
                    onChange={(e) => {
                      setFieldValue('bankId', e.target.value);
                    }}
                    items={banks.data}
                  />
                </Grid>

                <Grid item xs={6}>
                  <SelectCheckbox
                    error={Boolean(touched.merchants && errors.merchants)}
                    labelId="merchants"
                    helperText={touched.merchants && errors.merchants}
                    label={t('merchants')}
                    name="merchants"
                    onBlur={handleBlur}
                    value={
                      values.merchants !== undefined ? values.merchants : []
                    }
                    sx={{ m: 0 }}
                    onChange={(e) => {
                      setFieldValue('merchants', e.target.value);
                    }}
                    items={merchants.data}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SelectCheckbox
                    error={Boolean(touched.jobs && errors.jobs)}
                    labelId="jobs"
                    helperText={touched.jobs && errors.jobs}
                    label={t('Reconciliation type')}
                    name="jobs"
                    onBlur={handleBlur}
                    value={values.jobs !== undefined ? values.jobs : []}
                    sx={{ m: 0 }}
                    onChange={(e) => {
                      setFieldValue('jobs', e.target.value);
                    }}
                    items={types.items}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="status-select-label">Statuses</InputLabel>
                    <Select
                      labelId="status-select-label"
                      id="statuses"
                      name="statuses"
                      multiple
                      value={values.statuses}
                      onChange={handleChange}
                      renderValue={(selected) =>
                        selected.map((status) => t(status)).join(', ')
                      }
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          <Checkbox
                            checked={values.statuses.indexOf(status) > -1}
                          />
                          <ListItemText primary={t(status)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="От"
                    type="date"
                    name="startDate"
                    value={values.startDate || ''}
                    onChange={(e) => setFieldValue('startDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="До"
                    type="date"
                    name="endDate"
                    value={values.endDate || ''}
                    onChange={(e) => setFieldValue('endDate', e.target.value)}
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}
                    error={touched.endDate && Boolean(errors.endDate)}
                    helperText={touched.endDate && errors.endDate}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">{t('resolved')}</FormLabel>
                    <RadioGroup
                      row
                      name="resolved"
                      value={
                        values.resolved === null
                          ? ''
                          : values.resolved.toString()
                      }
                      onChange={(event) => {
                        const value = event.target.value === 'true';
                        setFieldValue('resolved', value);
                      }}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Да"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Нет"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                {t('Cancel button')}
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {t('Apply button')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default FilterDialog;
