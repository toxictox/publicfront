import React from 'react';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { Formik } from 'formik';
import axios from '@lib/axios';
import { app } from '@root/config';
import { toast } from "react-hot-toast";

import {
  Box,
  Grid,
  Button,
  TextField,
  Modal,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
  InputAdornment,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5]
  },
}));

const TransferModalForm = ({source, open, merchant, onClose, onUpdate, ...props}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(open);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [accountList, setAccountList] = React.useState({
    items: []
  });

  React.useEffect(() => {
    setIsOpen(open);
    getAccounts(merchant);
  }, [open]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const getAccounts = (merchant) => {
    if (merchant) {
      axios.get(`${app.api}/merchant/${merchant}/account`,
        {
          params: {
            count: 100
          }
        }
      ).then((response) => {
        setAccountList(response.data);
      });
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsOpen(false);
    setIsError(false);
    if (onClose) {
        onClose();
    }
  };

  const values =
  {
    source: source ? source : null,
    target: "",
    amount: 100
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setIsError(false);

    await axios({
      method: 'post',
      url:  `${app.api}/merchant/${merchant}/account/transfer` + (values.id ? `/${values.id}` : ''),
      data: {
        source: values.source,
        target: values.target,
        amount: Math.floor(values.amount * 100)
      }
    })
    .then(async (response) => {
      toast.success(values.id ? t("Successfully updated") : t("Successfully created"));
      handleClose();
      if (onUpdate) {
        onUpdate();
      }
    })
    .catch(async (error) => {
      setIsError(true);
    });
  };

  const validationSchema = 
    Yup.object().shape({
      target: Yup.string().min(1),
      source: Yup.string().min(1),
      amount: Yup.number().min(100),
    });

  const form = (
    <>
    {isError &&
      <Alert severity='error'>
        <AlertTitle>{t('Error!')}</AlertTitle>
        {t('An error occurred during creating account. Please try again later.')}
      </Alert>
    }
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        isSubmitting,
        touched,
        values,}) => (
          <form noValidate onSubmit={handleSubmit} {...props}>
            <Grid item xs={12}>
                <TextField
                    error={Boolean(touched.source && errors.source)}
                    fullWidth
                    helperText={touched.source && errors.source}
                    label="source"
                    name="source"
                    onChange={(e ,f) => {
                        if (f.props.value == values.target) {
                            values.target = "";
                        }
                        handleChange(e, f);
                    }}
                    onBlur={handleBlur}
                    select
                    value={values.source}
                    margin="normal"
                >
                    <MenuItem value={""}>
                    {t("Select value")}
                    </MenuItem>
                    {accountList.items.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    error={Boolean(touched.target && errors.target)}
                    fullWidth
                    helperText={touched.target && errors.target}
                    label="target"
                    name="target"
                    onChange={(e ,f) => {
                        if (values.source == f.props.value) {
                            values.source = "";
                        }
                        handleChange(e, f);
                    }}
                    onBlur={handleBlur}
                    select
                    value={values.target}
                    margin="normal"
                >
                    <MenuItem value={""}>
                    {t("Select value")}
                    </MenuItem>
                    {accountList.items.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12}>
                <TextField
                label={t('amount')}
                value={values.amount}
                name="amount"
                fullWidth
                onBlur={handleBlur}
                onChange={handleChange}
                margin="normal"
                type="number"
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                InputProps={{
                  endAdornment: <InputAdornment position="end">&#8376;</InputAdornment>,
                }}
                />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  disabled={isSubmitting || !Boolean(Object.keys(errors).length === 0)}
                  type="submit"
                  variant="contained"
                  size="small"
                >
                  {values.id ? t('Update') : t('Create')}
                </Button>
              </Box>
            </Grid>
          </form>
        )}
    </Formik>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modal}
      >
        <Card className={classes.paper}>
          <CardHeader title={values.id ? t('Edit account') : t('Create account')}/>
          <CardContent>
            {form}
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default TransferModalForm;
