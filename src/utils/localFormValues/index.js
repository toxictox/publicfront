export const setLocalFormValues = (formName, formValues) => {
  const savedFormValues = getSavedFormValues();
  const newFormValues = { ...savedFormValues, [formName]: formValues };
  localStorage.setItem('localFormValues', JSON.stringify(newFormValues));
};

export const getLocalFormValues = (formName) => {
  const savedFormValues = getSavedFormValues();
  return savedFormValues[formName];
};

function getSavedFormValues() {
  return localStorage.getItem('localFormValues')
    ? JSON.parse(localStorage.getItem('localFormValues'))
    : {};
}
