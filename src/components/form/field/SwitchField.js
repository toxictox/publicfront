
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    FormControlLabel,
    Switch,
  } from '@material-ui/core';

const SwitchField = ({label, value, key, handleChange}) => {
      const { t } = useTranslation();

    return (
        <FormControlLabel control={
            <Switch
                checked={value}
                name={key}
                onChange={handleChange}
                color={value ? "success" : "error"}
            />}
            label={value ? t("Yes") : t("No")}
        />
    );
};

export default SwitchField;

