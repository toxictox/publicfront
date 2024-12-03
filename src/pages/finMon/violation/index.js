import useAuth from '@hooks/useAuth';
import useSettings from '@hooks/useSettings';
import {
  Box,
  Card,
  CardHeader,
  Container,
  Divider,
  TablePagination
} from '@material-ui/core';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import FilterForm from './FilterForm';
import ViolationTable from './ViolationTable';
import { useViolations } from './useViolations';

const FinMonViolationIndex = () => {
  const { dataList, page, count, setPage, setCount, setFilters } =
    useViolations();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const { user } = useAuth();
  const handlePageChange = (e, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (e) => setCount(e.target.value);

  const initialValues = {
    merchantIds: [],
    tranId: '',
    dateFrom: '',
    dateTo: ''
  };

  const handleFilterSubmit = (values) => {
    const filters = {
      merchantIds: values.merchantIds,
      tranId: values.tranId,
      dateFrom: values.dateFrom,
      dateTo: values.dateTo
    };
    setFilters(filters);
  };

  return (
    <>
      <Helmet>
        <title>Violation List</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Card sx={{ mt: 2 }}>
            <CardHeader title={t('violationList')} />
            <Divider />

            <FilterForm
              initialValues={initialValues}
              onSubmit={handleFilterSubmit}
              merchants={user.merchants}
            />

            <Divider />
            <ViolationTable dataList={dataList} />
            <TablePagination
              count={dataList.count}
              page={page}
              rowsPerPage={count}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default FinMonViolationIndex;
