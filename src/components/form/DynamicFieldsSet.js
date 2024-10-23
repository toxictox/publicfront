import React from 'react';
import DynamicField from './field/DynamicField';

const DynamicFieldsSet = ({fields, value, name, ...props}) => {
    return (
        <>
        {fields.length !== 0
        ? fields.map((item) => (
            <DynamicField
                value={value[item.name]}
                label={item.label}
                name={`${name}.${item.name}`}
                type={item.type}
                options={item.options}
                {...props}
            />
            ))
        : null
        }
        </>
    );
};

export default DynamicFieldsSet;
