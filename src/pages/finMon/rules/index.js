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
import RuleModalForm from "@comp/finMon/rule/RuleModalForm";
import RuleFilterForm from "@comp/finMon/rule/RuleFilterForm";

const FinMonRuleIndex = () => {
  const { user } = useAuth();
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
  const [filter, setFilter] = useState({});

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  const fetchRules = useCallback(async () => {
    axios.get(`${app.api}/finMon/rules/`, {
      params: {
        page: page + 1,
        count: count,
        ...filter
      }
    }).then((response) => {
      setDataList(response.data);
    });
  }, [page, count, filter]);

  const deleteRule = async (id) => {
    axios.delete(`${app.api}/finMon/rules/${id}`).then(fetchRules);
  };

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };


  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return (
    <>
      <Helmet>
        <title>{t("Financial Monitoring Rules")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>

          <RuleModalForm
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={fetchRules}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Financial Monitoring Rules")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("finmonRules", "create"),
                      callback: () => {
                        openForm(null);
                      },
                    }}
                  />
                }
              />
              <Divider />
              <RuleFilterForm
                onSubmit={setFilter}
              />
              <Divider />
              <TableStatic
                header={[
                  "id",
                  "type",
                  "filterMerchants",
                  "filterTransactionTypes",
                  "critical",
                  "Enabled",
                  "",
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.filterMerchants ? item.merchants.join(', ') : t("All")}</TableCell>
                        <TableCell>{item.filterTransactionTypes ? item.transactionTypes.join(' ') : t("All")}</TableCell>
                        <TableCell>{item.critical ? t("Blocking") : t("Alert only")}</TableCell>
                        <TableCell>{item.enabled ? t("Enabled") : t("Disabled")}</TableCell>
                        <TableCell
                              align="right"
                              className="static-table__table-cell"
                        >
                          <GroupTable
                            actionUpdate={() => {
                              openForm(item);
                            }}
                            actionDelete={() => {
                                deleteRule(item.id)
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

export default FinMonRuleIndex;
