// Модифицированный DynamicFieldsSet.js

import React from 'react';
import DynamicField from './field/DynamicField';

const DynamicFieldsSet = ({fields, value, name, onChange, ...props}) => {
    // Проверяем и преобразуем value, если это массив
    const handleFieldChange = (e) => {
        // Получаем оригинальное событие
        const { name: fieldName, value: fieldValue } = e.target;

        // Проверяем, относится ли поле к нашему набору options
        if (fieldName.startsWith(`${name}.`)) {
            // Получаем имя поля без префикса options.
            const fieldKey = fieldName.split('.')[1];

            // Создаем модифицированное событие
            const modifiedEvent = {
                target: {
                    name: fieldName,
                    value: fieldValue,
                    // Добавляем метаданные, чтобы Formik мог обрабатывать массив как объект
                    dataset: {
                        isOptionsField: true,
                        fieldKey: fieldKey
                    }
                }
            };

            // Вызываем обработчик с модифицированным событием
            onChange(modifiedEvent);
        } else {
            // Для других полей просто передаем событие
            onChange(e);
        }
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
                            label={item.label}
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