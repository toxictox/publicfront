import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Grid,
  MenuItem
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import React from 'react';

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
    <form noValidate onSubmit={handleSubmit} {...externalProps} >
      <Box m={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.company && errors.company)}
              fullWidth
              helperText={touched.company && errors.company}
              label={`${t('company')} *`}
              margin="normal"
              name="company"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.company}
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
          {values.company.length === 0 && (
            <>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched?.newCompany?.name && errors?.newCompany?.name)}
                  fullWidth
                  helperText={touched?.newCompany?.name && errors?.newCompany?.name}
                  label={`${t('companyName')} *`}
                  margin="normal"
                  name="newCompany.name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values?.newCompany?.name}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched?.newCompany?.companyEmail && errors?.newCompany?.companyEmail)}
                  fullWidth
                  helperText={touched?.newCompany?.companyEmail && errors?.newCompany?.companyEmail}
                  label={`${t('companyEmail')}`}
                  margin="normal"
                  name="newCompany.companyEmail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values?.newCompany?.companyEmail}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched?.newCompany?.iin && errors?.newCompany?.iin)}
                  fullWidth
                  helperText={touched?.newCompany?.iin && errors?.newCompany?.iin}
                  label={`${t('companyIin')}`}
                  margin="normal"
                  name="newCompany.iin"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values?.newCompany?.iin}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(touched?.newCompany?.bankAccountNumber && errors?.newCompany?.bankAccountNumber)}
                  fullWidth
                  helperText={touched?.newCompany?.bankAccountNumber && errors?.newCompany?.bankAccountNumber}
                  label={`${t('companyBankAccountNumber')}`}
                  margin="normal"
                  name="newCompany.bankAccountNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values?.newCompany?.bankAccountNumber}
                  variant="outlined"
                  size="small"
                  sx={{ m: 0 }}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              autoFocus
              error={Boolean(touched.name && errors.name)}
              fullWidth
              helperText={touched.name && errors.name}
              label={`${t('merchantName')} *`}
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
              error={Boolean(touched.timezone && errors.timezone)}
              fullWidth
              helperText={touched.timezone && errors.timezone}
              label={`${t('timezone')} *`}
              margin="normal"
              name="timezone"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              select
              value={values.timezone}
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

          {values.design.length === 0 && (
            <Grid item xs={12}>
              <TextField
                error={Boolean(touched?.newDesign?.name && errors?.newDesign?.name)}
                fullWidth
                helperText={touched?.newDesign?.name && errors?.newDesign?.name}
                label={`${t('designName')} *`}
                margin="normal"
                name="newDesign.name"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values?.newDesign?.name}
                variant="outlined"
                size="small"
                sx={{ m: 0 }}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              error={Boolean(touched.type && errors.type)}
              fullWidth
              helperText={touched.type && errors.type}
              label={`${t('type_operation')}`}
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
              error={Boolean(touched.notificationChannel && errors.notificationChannel)}
              fullWidth
              helperText={touched.notificationChannel && errors.notificationChannel}
              label={`${t('notificationChannel')}`}
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

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                // disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                disabled={isSubmitting}
                type="submit"
                variant="contained"
                size="large"
              >
                {values.id ? t('Update') : t('Create')}
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
