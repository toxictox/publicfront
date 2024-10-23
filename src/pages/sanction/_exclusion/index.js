import { Box, Card, CardHeader, Container, Divider, TableCell, TablePagination, TableRow, Typography } from '@material-ui/core'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

import useMounted from '@hooks/useMounted'
import useSettings from '@hooks/useSettings'

import { GroupTable } from '@comp/core/buttons'
import { TableStatic } from '@comp/core/tables'
import WhiteListFilterForm from '@comp/sanction/WhiteListFilterForm'
import WhiteListModalForm from '@comp/sanction/WhiteListModalForm'
import useAuth from '@hooks/useAuth'
import axios from '@lib/axios'
import { red } from '@material-ui/core/colors'
import { app } from '@root/config'
import { useTranslation } from 'react-i18next'

const SanctionExclusionList = () => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [filter, setFilter] = useState([]);
  const { getAccess } = useAuth();

  const openForm = () => {
    setModalFormOpen(true);
  };

  const closeForm = () => {
    setModalFormOpen(false);
  };

  const deleteItem = (itemId) => {
    axios
        .delete(`${app.api}/sanction/exclusion/${itemId}`)
        .then((response) => {
            getSanctionsWhiteList();
        });
  }

  const getSanctionsWhiteList = useCallback(async () => {
    await axios
      .get(`${app.api}/sanction/exclusion`,
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
    getSanctionsWhiteList();
  }, [getSanctionsWhiteList]);

  return (
    <>
      <Helmet>
        <title>{t("Sanctions White List")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>

          <WhiteListModalForm
            open={isModalFormOpen}
            onClose={closeForm}
            onUpdate={getSanctionsWhiteList}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Sanctions White List")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("sanctionWhiteList", "create"),
                      callback: () => {
                        openForm();
                      },
                    }}
                  />
                }
              />
              <Divider />
              <WhiteListFilterForm
                onSubmit={setFilter}
              />
              <Divider />

              <TableStatic
                header={[
                  "id",
                  t("documentRef"),
                  t("customerId"),
                  t("merchant"),
                  t("createOn"),
,                 "",
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.documentRef}</TableCell>
                        <TableCell>{item.clientRef}</TableCell>
                        <TableCell>{item.merchant}</TableCell>
                        <TableCell>{item.createdAt}</TableCell>
                        <TableCell
                              align="right"
                              className="static-table__table-cell"
                        >
                          {item.deleted
                          ? <Typography color={red[800]}>
                              {t('Deleted')}
                            </Typography>
                          : <GroupTable
                          actionDelete={() => {
                            deleteItem(item.id);
                          }}
                          />
                          }
                        </TableCell>
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

export default SanctionExclusionList;
