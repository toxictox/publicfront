import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  TablePagination,
  TableRow,
  TableCell,
  Typography,
  CardContent,
  CardHeader,
  Card,
  Box,
  Container,
  Divider,
} from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import { useDispatch } from "react-redux";
import { TableStatic } from "@comp/core/tables";
import useSettings from "@hooks/useSettings";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import TransferModalForm from "./TransferModalForm";
import { GroupTable } from "@comp/core/buttons";
import useAuth from "@hooks/useAuth";

const OperationsList = ({ accountId, merchantId }) => {
  const mounted = useMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [dataList, setDataList] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(5);

  const navigate = useNavigate();
  const { getAccess } = useAuth();

  const formatAmount = (number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(number);
  };

  const { settings } = useSettings();

  const [isModalFormOpen, setModalFormOpen] = useState(false);

  const openForm = () => {
    setModalFormOpen(true);
  };

  const closeForm = () => {
    setModalFormOpen(false);
  };

  const getOperations = useCallback(async () => {
    axios.get(`${app.api}/merchant/${merchantId}/account/${accountId}/operation/`, {
      params: {
        page: page + 1,
        count: count,
      }
    }).then((response) => {
      if (mounted.current) {
        setDataList(response.data);
      }
    });
  }, [mounted, merchantId, accountId, page, count]);

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
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <TransferModalForm 
            source={accountId}
            merchant={merchantId}
            open={isModalFormOpen}
            onClose={closeForm}
            onUpdate={getOperations}
          />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Account operations")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("merchants", "update"),
                      callback: () => {
                        openForm();
                      },
                    }}
                  />
                }
              />
              <Divider />
              {dataList.items.length > 0
                ?
                <>
                  <TableStatic
                    header={[
                      "Id",
                      "Amount",
                      "Type",
                      "Description",
                      "Ref"
                    ]}
                  >
                    {dataList.items.map(function (item) {
                      return (
                        <>
                          <TableRow hover key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{formatAmount(item.amount)}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.description}</TableCell>
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
                </>
                :
                <CardContent>
                  <Typography>
                    {t('NoOperations', "No operations has been registred for this account yet.")}
                  </Typography>
                </CardContent>
              }
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default OperationsList;
