import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    TextField as TextFieldMUI,
  } from '@material-ui/core';

const TextField = ({label, value, name, onBlur, onChange, errors, options}) => {
    const { t } = useTranslation();

    return (
        <TextFieldMUI
            label={t(label)}
            value={value}
            name={name}
            fullWidth
            onBlur={onBlur}
            onChange={onChange}
            margin="normal"
            error={Boolean(errors[name])}
            helperText={options.helperText ?? ""}
        />
    );
};

export default TextField;
