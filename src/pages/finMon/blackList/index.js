import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TablePagination,
  TableCell,
} from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { GroupTable } from "@comp/core/buttons";
import { TableStatic } from "@comp/core/tables";
import useAuth from "@hooks/useAuth";
import BlackListModalForm from "@comp/finMon/blackList/BlackListModalForm";

const BlackListIndex = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setDataList] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const { getAccess } = useAuth();

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  const fetchItems = useCallback(async () => {
    axios.get(`${app.api}/finMon/black_list/`, {
      params: {
        page: page + 1,
        count: count,
      }
    }).then((response) => {
      setDataList(response.data);
    });
  }, [page, count]);

  const deleteItem = async (id) => {
    axios.delete(`${app.api}/finMon/black_list/${id}`).then(fetchItems);
  };

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      <Helmet>
        <title>{t("Financial Monitoring Black List")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>

          <BlackListModalForm
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={fetchItems}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Financial Monitoring Black List")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("finmonBlackList", "create"),
                      callback: () => {
                        openForm(null);
                      },
                    }}
                  />
                }
              />
              <Divider />
              <TableStatic
                header={[
                  "id",
                  "pan",
                  "token",
                  "iin",
                  "description",
                  "",
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.pan}</TableCell>
                        <TableCell>{item.token}</TableCell>
                        <TableCell>{item.iin}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell
                              align="right"
                              className="static-table__table-cell"
                        >
                          <GroupTable
                            actionUpdate={() => {
                              openForm(item);
                            }}
                            actionDelete={() => {
                                deleteItem(item.id)
                            }}
                            />
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

export default BlackListIndex;
