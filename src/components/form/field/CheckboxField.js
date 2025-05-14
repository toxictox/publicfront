
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';

const CheckboxField = ({label, value, name, handleBlur, onChange, setFieldValue}) => {
    const { t } = useTranslation();

    const handleChange = (e) => {
        const modifiedEvent = {
            target: {
                name: e.target.name,
                value: e.target.checked,
                dataset: {
                    isOptionsField: true,
                    fieldKey: e.target.dataset.fieldKey
                }
            }
        };

        onChange(modifiedEvent);
    }

    return (
        <FormControlLabel
          name={name}
          value={value}
          control={
            <Checkbox
              name={name}
              color="primary"
              onBlur={handleBlur}
              onChange={handleChange}
              checked={value}
            />
          }
          label={t(label)}
          labelPlacement="end"
        />
    );
};

export default CheckboxField;

