
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

const CheckboxField = ({label, value, name, handleBlur, onChange, setFieldValue}) => {
    const { t } = useTranslation();

    return (
        <FormControlLabel
          name={name}
          value={value}
          checked={value}
          control={
            <Checkbox
              name={name}
              color="primary"
              onBlur={handleBlur}
              onChange={onChange}
            />
          }
          label={t(label)}
          labelPlacement="end"
        />
    );
};

export default CheckboxField;

