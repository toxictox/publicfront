import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  TablePagination,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
} from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { TableStatic } from "@comp/core/tables";
import { GroupTable, CreateButton } from "@comp/core/buttons";
import useAuth from "@hooks/useAuth";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";

const TransactionsFlowList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAccess } = useAuth();

  const [dataList, setListData] = useState([]);
  const [page, setPage] = useState(0);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/tran_types?page=${page}&count=${25}`)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <>
      <Helmet>
        <title>{t("Transactions Flow List")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Box sx={{ mt: 1 }}>
            <Card sx={{ mt: 1 }}>
              <CardHeader
                title={t("Transactions Flow List")}
                action={
                  getAccess("flows", "create") ? (
                    <CreateButton
                      action={() => navigate("/flows/create")}
                      text={t("Create button")}
                    />
                  ) : null
                }
              />
              <Divider />
              <TableStatic header={["name", ""]}>
                {dataList.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() => navigate(`/flows/id/${item.id}`)}
                          actionCustom={[
                            {
                              access: getAccess("flows", "create"),
                              title: t("Copy button"),
                              callback: (e) => {
                                e.stopPropagation();
                                navigate(`/flows/create`, {
                                  state: {
                                    id: item.id,
                                  },
                                });
                              },
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
            <TablePagination
              component="div"
              count={dataList.length}
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={25}
              rowsPerPageOptions={[25]}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsFlowList;
