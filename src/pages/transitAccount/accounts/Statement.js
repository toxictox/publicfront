import { BackButton, GroupTable } from '@comp/core/buttons';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getStatement } from '../helper';
import StatementTable from './StatementTable';

const Statement = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { id } = useParams();
  const [page, setPage] = useState(0);
  const [data, setData] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/transit-account/transitTransactions');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStatement(page + 1, id);
        setData(result);
        setTotalRows(result.count);
      } catch (error) {
        toast.error('Error!');
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [page, id]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createStatement = () => {
    handleOpen();
  };

  const handleSubmit = (values) => {
    console.log('Form values:', values);
    handleClose();
  };

  return (
    <>
      {isAuthenticated && (
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 2
          }}
        >
          <Container maxWidth={settings.compact ? 'xl' : false}>
            <BackButton
              action={() => navigate('/transit-account/transitTransactions')}
            />
            <Box sx={{ minWidth: 700 }}>
              <Card sx={{ mt: 2 }}>
                <CardHeader
                  title={t('Account statements')}
                  action={
                    <GroupTable
                      actionCreate={{
                        callback: () => createStatement()
                      }}
                    />
                  }
                />
                <Divider />
                {data && (
                  <StatementTable
                    data={data}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </Card>
            </Box>
          </Container>
        </Box>
      )}
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
                />
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    {t('Cancel button')}
                  </Button>
                  <Button onClick={submitForm} color="primary">
                    {t('Create button')}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Statement;
