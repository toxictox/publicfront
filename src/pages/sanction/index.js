import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardHeader, Container, Divider, TableCell, TablePagination, TableRow } from '@material-ui/core';

import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';

import axios from '@lib/axios';
import { app } from '@root/config';
import FilterForm from '@comp/sanction/FilterForm';
import { TableStatic } from '@comp/core/tables';
import { useTranslation } from 'react-i18next';

const SanctionsList = () => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    items: [],
    count: 0,
  });
  const [filter, setFilter] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);

  const getSanctions = useCallback(async () => {
    await axios
      .get(`${app.api}/sanction`,
      {
        params: {
          page: page + 1,
          count: count,
          ...filter
        }
      }
      )
      .then((response) => {
        setListData(response.data);
      });
  }, [mounted, count, page, filter]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    getSanctions();
  }, [getSanctions]);

  return (
    <>
      <Helmet>
        <title>{t("Sanctions List")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Sanctions List")}
              />
              <Divider />
              <FilterForm
                onSubmit={setFilter}
              />
              <Divider />

              <TableStatic
                header={[
                  "id",
                  "first name",
                  "last name",
                  "document reference",
                  "notes",
                  "source",
                  "extra",
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.firstName}</TableCell>
                        <TableCell>{item.lastName}</TableCell>
                        <TableCell>{item.docRef}</TableCell>
                        <TableCell>{item.note}</TableCell>
                        <TableCell>{item.source}</TableCell>
                        <TableCell>{(item.excluded ? t("Excluded") : "") + (item.critical ? " " + t("Critical") : "")}</TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableStatic>

              <TablePagination
                count={dataList.count}
                onPageChange={handlePageChange}
                page={page}
                rowsPerPage={count}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SanctionsList;
