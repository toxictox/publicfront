import React from 'react';
import TextField from './TextField';
import NumberField from './NumberField';
import CheckboxField from './CheckboxField';

const fieldComponents = {
    text: TextField,
    number: NumberField,
    checkbox: CheckboxField,
};

const DynamicField = ({type, ...props}) => {
    const SpecificField = fieldComponents[type];

    return (<SpecificField {...props} />);
};

export default DynamicField;
