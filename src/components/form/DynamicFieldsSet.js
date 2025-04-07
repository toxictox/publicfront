// Модифицированный DynamicFieldsSet.js

import React from 'react';
import DynamicField from './field/DynamicField';
import {useTranslation} from "react-i18next";

const DynamicFieldsSet = ({fields, value, name, onChange, ...props}) => {
    const { t } = useTranslation();
    // Проверяем и преобразуем value, если это массив
    const handleFieldChange = (e) => {
        const { name: fieldName, type } = e.target;
        const fieldKey = fieldName.split('.')[1];

        let fieldValue;

        if (type === 'checkbox') {
            fieldValue = e.target.checked;
        } else {
            fieldValue = e.target.value;
        }

        const modifiedEvent = {
            target: {
                name: fieldName,
                value: fieldValue,
                dataset: {
                    isOptionsField: true,
                    fieldKey: fieldKey
                }
            }
        };

        onChange(modifiedEvent);
    };

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
                            onChange={handleFieldChange}
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