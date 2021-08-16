import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  TablePagination,
  Card,
  Link,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
} from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { TableStatic } from "@comp/core/tables";
import { GroupTable, CreateButton } from "@comp/core/buttons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";

const TransactionsFlowList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dataList, setListData] = useState({
    data: [],
  });
  const [page, setPage] = useState(0);

  // useEffect(() => {
  //   gtm.push({ event: "page_view" });
  // }, []);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/users?page=${page}&count=${25}`)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
    //getOrders();
    await axios
      .post(`${app.api}/users?page=${newPage}&count=${25}`)
      .then((response) => {
        setListData(response.data);
      });
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
                  <CreateButton
                    action={() => navigate("/flow/create")}
                    text={t("Create button")}
                  />
                }
              />
              <Divider />
              <TableStatic
                header={[
                  "email table",
                  "firstName",
                  "phone",
                  "loginTries",
                  "lastLogin",
                  "",
                ]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow
                      hover
                      key={item.hash}
                      onClick={() => navigate(`/flow/id/${item.hash}`)}
                    >
                      <TableCell>
                        <Link
                          color="textLink"
                          component={RouterLink}
                          to={`/users/id/${item.hash}`}
                          underline="none"
                          variant="subtitle2"
                        >
                          {item.email}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {item.firstName} {item.lastName}
                      </TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.loginTries}</TableCell>
                      <TableCell>
                        {item.lastLogin ? item.lastLogin.date : null}
                      </TableCell>
                      <TableCell>
                        <GroupTable
                          actionView={() => navigate(`/flow/id/${item.hash}`)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
            <TablePagination
              component="div"
              count={dataList.count}
              onPageChange={() => handlePageChange(page + 1)}
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
