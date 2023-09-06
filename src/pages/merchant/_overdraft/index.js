import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TablePagination,
  Link,
  TableCell,
} from "@material-ui/core";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { BackButton } from "@comp/core/buttons";
import { TableStatic } from "@comp/core/tables";
import { toLocaleDateTime } from "@lib/date";
import useAuth from "@hooks/useAuth";

const OverdraftIndex = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setDataList] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const formatAmount = (number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(number);
  };

  const [merchId] = React.useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const getOperations = useCallback(async () => {
    axios.get(`${app.api}/merchant/${merchId}/overdraft`, {
      params: {
        page: page + 1,
        count: count
      }
    }).then((response) => {
      setDataList(response.data);
    });
  }, [merchId, page, count]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    getOperations();
  }, [getOperations]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant Overdraft History")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/merchants/id/${id}`)} />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Merchant Overdraft History")} />
              <Divider />
              <TableStatic
                header={[
                  "amount",
                  "createOn",
                  "transaction",
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>

                        <TableCell>{formatAmount(item.amount / 100)}</TableCell>
                        <TableCell>{toLocaleDateTime(item.date.date)}</TableCell>
                        <TableCell>
                          <Link
                            color="textPrimary"
                            component={RouterLink}
                            to={`/transactions/${item.transaction.guid}`}
                            underline="none"
                            variant="subtitle2"
                          >{item.transaction.tranId}</Link>
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

export default OverdraftIndex;
