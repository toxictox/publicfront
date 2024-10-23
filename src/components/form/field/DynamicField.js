import React from 'react';
import TextField from './TextField';
import NumberField from './NumberField';


const fieldComponents = {
    text: TextField,
    number: NumberField,
};

const DynamicField = ({type, ...props}) => {
    const SpecificField = fieldComponents[type];

    return (<SpecificField {...props} />);
};

export default DynamicField;
