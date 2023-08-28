import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  MenuItem
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const CreateAndUpdateMerchantForm = (data) => {
  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    touched,
    values,
    timezoneData,
    companies,
    designId,
    types,
    notificationChannels,
    externalProps
  } = data;

  const { t } = useTranslation();
  return (
    <form noValidate onSubmit={handleSubmit} {...externalProps}>
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.company_id && errors.company_id)}
              fullWidth
              helperText={touched.company_id && errors.company_id}
              label={`${t('Company')} *`}
              margin="normal"
              name="company_id"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.company_id}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            >
              <MenuItem key={-1} value={''}>
                {t('Select value')}
              </MenuItem>
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              autoFocus
              error={Boolean(touched.name && errors.name)}
              fullWidth
              helperText={touched.name && errors.name}
              label={`${t('name')} *`}
              margin="normal"
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.name}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.description && errors.description)}
              fullWidth
              helperText={touched.description && errors.description}
              label={t('description')}
              margin="normal"
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.description}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.businessName && errors.businessName)}
              fullWidth
              helperText={touched.businessName && errors.businessName}
              label={t('businessName')}
              margin="normal"
              name="businessName"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.businessName}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.contractNumber && errors.contractNumber)}
              fullWidth
              helperText={touched.contractNumber && errors.contractNumber}
              label={t('contractNumber')}
              margin="normal"
              name="contractNumber"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.contractNumber}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.contractDate && errors.contractDate)}
              fullWidth
              helperText={touched.contractDate && errors.contractDate}
              label={t('contractDate')}
              margin="normal"
              name="contractDate"
              onBlur={handleBlur}
              onChange={handleChange}
              type="datetime-local"
              value={values.contractDate}
              variant="outlined"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
              sx={{ m: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.fixAmountFee && errors.fixAmountFee)}
              fullWidth
              helperText={touched.fixAmountFee && errors.fixAmountFee}
              label={t('fixAmountFee')}
              margin="normal"
              name="fixAmountFee"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.fixAmountFee}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.percentFee && errors.percentFee)}
              fullWidth
              helperText={touched.percentFee && errors.percentFee}
              label={t('percentFee')}
              margin="normal"
              name="percentFee"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.percentFee}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.minAmountFee && errors.minAmountFee)}
              fullWidth
              helperText={touched.minAmountFee && errors.minAmountFee}
              label={t('minAmountFee')}
              margin="normal"
              name="minAmountFee"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.minAmountFee}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.timezoneId && errors.timezoneId)}
              fullWidth
              helperText={touched.timezoneId && errors.timezoneId}
              label={`${t('timezoneId')} *`}
              margin="normal"
              name="timezoneId"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.timezoneId}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            >
              <MenuItem key={-1} value={''}>
                {t('Select value')}
              </MenuItem>
              {timezoneData.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.design && errors.design)}
              fullWidth
              helperText={touched.design && errors.design}
              label={`${t('design')} *`}
              margin="normal"
              name="design"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.design}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            >
              <MenuItem key={-1} value={''}>
                {t('Select value')}
              </MenuItem>
              {designId.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.type && errors.type)}
              fullWidth
              helperText={touched.type && errors.type}
              label={`${t('type_operation')} *`}
              margin="normal"
              name="type"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.type}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            >
              <MenuItem key={-1} value={''}>
                {t('Select value')}
              </MenuItem>
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.design && errors.design)}
              fullWidth
              helperText={touched.design && errors.design}
              label={`${t('notificationChannel')} *`}
              margin="normal"
              name="notificationChannel"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.notificationChannel}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
            >
              <MenuItem key={-1} value={''}>
                {t('Select value')}
              </MenuItem>
              {notificationChannels.map((notificationChannel) => (
                <MenuItem key={notificationChannel} value={notificationChannel}>
                  {notificationChannel}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {values.notificationChannel ? (
            <Grid item xs={12}>
              <TextField
                autoFocus
                error={Boolean(
                  touched[`сompany_${values.notificationChannel}`] &&
                    errors[`сompany_${values.notificationChannel}`]
                )}
                fullWidth
                helperText={
                  touched[`сompany_${values.notificationChannel}`] &&
                  errors[`сompany_${values.notificationChannel}`]
                }
                label={t(`field_${values.notificationChannel}`) + ' *'}
                margin="normal"
                name={`сompany_${values.notificationChannel}`}
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values[`сompany_${values.notificationChannel}`]}
                variant="outlined"
                size="small"
                sx={{ m: 0 }}
              />
            </Grid>
          ) : null}

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.overdraftLimit && errors.overdraftLimit)}
              fullWidth
              helperText={touched.overdraftLimit && errors.overdraftLimit}
              label={t('overdraftLimit')}
              margin="normal"
              name="overdraftLimit"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.overdraftLimit}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
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
                {t('Update button')}
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
  );
};

export default CreateAndUpdateMerchantForm;
