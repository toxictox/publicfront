
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
    FormControlLabel,
    Switch,
  } from '@material-ui/core';

const SwitchField = ({label, value, key, onChange}) => {
      const { t } = useTranslation();

    return (
        <FormControlLabel control={
            <Switch
                checked={value}
                name={key}
                onChange={onChange}
                color={value ? "success" : "error"}
            />}
            label={value ? t("Yes") : t("No")}
        />
    );
};

export default SwitchField;

