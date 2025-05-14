// Модифицированный DynamicFieldsSet.js

import React from 'react';
import DynamicField from './field/DynamicField';
import {useTranslation} from "react-i18next";

const DynamicFieldsSet = ({fields, value, name, onChange, ...props}) => {
    const { t } = useTranslation();

    return (
        <>
            {fields.length !== 0
                ? fields.map((item) => {
                    // Определяем текущее значение поля
                    // Если value - массив, исправляем и используем свойство как с объектом
                    const fieldValue = Array.isArray(value)
                        ? value[item.name] || ''
                        : (value && value[item.name]) || '';

                    return (
                        <DynamicField
                            key={item.name}
                            value={fieldValue}
                            label={t(item.label)}
                            name={`${name}.${item.name}`}
                            type={item.type}
                            options={item.options}
                            onChange={onChange}
                            onBlur={props.onBlur}
                            errors={props.errors}
                        />
                    );
                })
                : null
            }
        </>
    );
};

export default DynamicFieldsSet;