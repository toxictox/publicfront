import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const CreateStatementDialogMerchant = ({ open, handleClose, handleSubmit }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    start: Yup.string().required(t('Start Date is required')),
    end: Yup.string().required(t('End Date is required'))
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {t('Create New Statement')}
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            start: '',
            end: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            submitForm,
            isValid,
            handleChange,
            handleBlur,
            values
          }) => (
            <Form>
              <TextField
                name="start"
                type="date"
                label={t('Start Date')}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                value={values.start}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.start && Boolean(errors.start)}
                helperText={touched.start && errors.start}
              />
              <TextField
                name="end"
                type="date"
                label={t('End Date')}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true
                }}
                value={values.end}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.end && Boolean(errors.end)}
                helperText={touched.end && errors.end}
              />
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  {t('Cancel button')}
                </Button>
                <Button
                  onClick={submitForm}
                  color="primary"
                  disabled={!isValid}
                >
                  {t('Create button')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStatementDialogMerchant;
