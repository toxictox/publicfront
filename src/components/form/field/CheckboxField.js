
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
          control={
            <Checkbox
              name={name}
              color="primary"
              onBlur={handleBlur}
              onChange={onChange}
              checked={value}
            />
          }
          label={t(label)}
          labelPlacement="end"
        />
    );
};

export default CheckboxField;

