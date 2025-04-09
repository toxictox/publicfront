import { CreateButton } from '@comp/core/buttons';
import useAuth from '@hooks/useAuth';
import useSettings from '@hooks/useSettings';
import { Box, Card, CardHeader, Container } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { getMaintenance } from './helper';
import TableComponent from './TableComponent';

const Maintenance = () => {
  const { compact } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAccess } = useAuth();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(25);

  const fetchMaintenance = useCallback(async () => {
    try {
      const response = await getMaintenance(page + 1, count);
      setData(response);
    } catch (error) {
      toast.error(t('Error!'));
    }
  }, [page, count, t]);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 2
      }}
    >
      <Container maxWidth={compact ? 'xl' : false}>
        <Box sx={{ mt: 1 }}>
          <Card sx={{ mt: 1 }}>
            <CardHeader
              title={t('Maintenance')}
              action={
                getAccess('maintenance', 'create') && (
                  <CreateButton
                    action={() => navigate('/maintenance/create')}
                    text={t('Create button')}
                  />
                )
              }
            />
            {data && (
              <TableComponent
                data={data}
                page={page}
                count={count}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setCount(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                onDataUpdate={(updatedData) => setData(updatedData)}
              />
            )}
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Maintenance;
