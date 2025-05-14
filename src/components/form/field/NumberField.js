import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    TextField as TextFieldMUI,
  } from '@material-ui/core';

const NumberField = ({label, value, name, onBlur, onChange, errors, options}) => {
    const { t } = useTranslation();

    const handleChange = (e) => {
        const value = Number(e.target.value);

        const modifiedEvent = {
            target: {
                name: e.target.name,
                value: value,
                dataset: {
                    isOptionsField: true,
                    fieldKey: e.target.dataset.fieldKey
                }
            }
        };

        onChange(modifiedEvent);
    }

    return (
        <TextFieldMUI
            label={t(label)}
            value={value}
            name={name}
            fullWidth
            onBlur={onBlur}
            onChange={handleChange}
            margin="normal"
            type="number"
            error={Boolean(errors[name])}
            helperText={options?.helperText ?? ""}
        />
    );
};

export default NumberField;
