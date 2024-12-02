import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Box, Card, CardHeader, Container, Divider, TableCell, TablePagination, TableRow } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';

import axios from '@lib/axios';
import { app } from '@root/config';
import { TableStatic } from '@comp/core/tables';
import { useTranslation } from 'react-i18next';
import { element } from 'prop-types';

const FinMonViolationIndex = () => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    items: [],
    count: 0,
  });
  const [transactionList, setTransactionList] = useState({
  });
  const [transactionCountList, setTransactionCountList] = useState({
  });
  const [a2cTranType, seta2cTranType] = useState(0);
  const [respCodeId, setRespCodeId] = useState(0);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);

  const fetchTranType = async () => {
    if (a2cTranType != 0) {
      return;
    }

    await axios.get(`${app.api}/filter/tran_types`)
      .then((response) => {
        const item = response.data.find((element) => element.name == 'a2c');
        if (item) {
          seta2cTranType(item.id);
        }
    });
  };

  const fetchRespCode = async () => {
    if (respCodeId != 0) {
      return ;
    }

    await axios.get(`${app.api}/filter/codes`)
    .then((response) => {
      const item = response.data.data.find((element) => element.internal == '1000');
      if (item) {
        setRespCodeId(item.id);
      }
    });
  };

  const fetchViolations = async () => {
    await axios.get(`${app.api}/finMon/violation`,
      {
        params: {
          page: page + 1,
          count: count,
        }
      }
    ).then((response) => {
      setListData(response.data);
      response.data.items.forEach((item) => fetchTransaction(item.transaction));
    });
  };

  useEffect(() => {
    fetchTranType();
    fetchRespCode();
  }, [mounted]);

  useEffect(() => {
    if (respCodeId != 0 && a2cTranType != 0) {
      fetchViolations();
    }
  }, [count, page]);

  useEffect(() => {
    if (respCodeId != 0 && a2cTranType != 0) {
      fetchViolations();
    }
  }, [a2cTranType, respCodeId]);

  const fetchTransaction = async (transactionRef) => {
    if (!(transactionRef in transactionList)) {
        await axios.get(`${app.api}/transaction/${transactionRef}`)
        .then((response) => {
            setTransactionList(state => (
                {...state, [transactionRef]: response.data}
            ));
            fetchTransactionCount(response.data);
        });
    }
  };

  const fetchTransactionCount = (transaction) => {
    if (!(transaction.uuid in transactionCountList)) {
      const today = new Date();
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - 30);
      axios.get(`${app.api}/transactions`,
        {
          params: {
            merchant: transaction.merchantId,
            cardHash: transaction.panHash,
            respCode: [respCodeId],
            tranTypes: [a2cTranType],
            dateFrom: targetDate.toUTCString()
          }
        }
      ).then((response) => {
        setTransactionCountList(state => (
          {...state, [transaction.uuid]: response.data.count}
        ));
      })
    }
  };

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  const getTransactionsListQuery = (transaction) => {
    const params = {
      merchant: transaction.merchantId,
      cardHash: transaction.panHash,
      respCode: [respCodeId],
      tranTypes: [a2cTranType],
    };

    return new URLSearchParams(params).toString();
  };

  return (
    <>
      <Helmet>
        <title>{t("Violation List")}</title>
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
                title={t("Violation List")}
              />
              <Divider />

              <TableStatic
                header={[
                    "createOn",
                    "transaction",
                    "amount",
                    "respCode",
                    "tranType",
                    "merchant",
                    "clientId",
                    "customerEmail",
                    "pan",
                    'gateway',
                    "message",
                    "critical",
                    ""
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.id}>
                        <TableCell>{item.transaction in transactionList ? transactionList[item.transaction].createOn : t("Loading...")}</TableCell>
                        <TableCell>
                            <Link
                                component={RouterLink}
                                to={`/transactions/${item.transaction}`}
                                underline="none"
                                variant="subtitle2"
                            >{item.transaction}</Link>
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].amount : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? `${transactionList[item.transaction].respCode} ${transactionList[item.transaction].respMessage}` : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].tranType : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].merchant : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].client : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].customerEmail : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].pan : t("Loading...")}
                        </TableCell>
                        <TableCell>
                          {item.transaction in transactionList ? transactionList[item.transaction].gateway : t("Loading...")}
                        </TableCell>
                        <TableCell>{item.message}</TableCell>
                        <TableCell>{item.isCritical ? t("Blocking") : t("Alert only")}</TableCell>
                        <TableCell>
                          {item.transaction in transactionCountList ?
                            <Link
                              component={RouterLink}
                              to={`/transactions?` + getTransactionsListQuery(transactionList[item.transaction])}
                              underline="none"
                              variant="subtitle2"
                            >
                              {transactionCountList[item.transaction]}
                            </Link>
                          : t("Loading...")
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

export default FinMonViolationIndex;
