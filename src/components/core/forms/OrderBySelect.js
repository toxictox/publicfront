import {
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function OrderBySelect(props) {
  const { t } = useTranslation();
  const { touched, handleBlur, handleChange, errors, values } = props;
  return (
    <Grid item xs={3}>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel
          sx={{
            backgroundColor: '#ffffff',
            padding: '0 5px',
          }}
          htmlFor="sortDate"
        >
          {t('orderBy')}
        </InputLabel>
        <Select
          id="sortDate"
          error={Boolean(touched.sortDate && errors.sortDate)}
          fullWidth
          select
          label={t('orderBy')}
          margin="normal"
          name="sortDate"
          onBlur={handleBlur}
          onChange={handleChange}
          type="text"
          value={values.sortDate}
          variant="outlined"
          size="small"
          sx={{
            m: 0,
            '& .css-17xdsu': {
              width: '60px',
            },
          }}
        >
          <MenuItem value="newest">{t('sortDescending')}</MenuItem>
          <MenuItem value="oldest">{t('sortAscending')}</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );
}
