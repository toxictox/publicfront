import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";

import {
  TablePagination,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";

import { toLocaleDateTime } from "@lib/date";
import useMounted from "@hooks/useMounted";
import { showConfirm } from "@slices/dialog";
import { useDispatch } from "react-redux";
import { TableStatic } from "@comp/core/tables";
import { Comment } from "@material-ui/icons";
import useAuth from "@hooks/useAuth";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";


const BankOperationList = ({ reload, bankId }) => {
  const { user } = useAuth();
  const mounted = useMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const [dataList, setDataList] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(5);

  const [merchId, setMerchId] = React.useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );

  const getOperations = useCallback(async () => {
    const merchant = user.merchants.find(merch => merch.merchantId = merchId);

    axios.get(`${app.api}/bank/${bankId}/operation`, {
      params: {
        page: page + 1,
        count: count,
        merchant: merchant.merchantId
      }
    }).then((response) => {
      if (mounted.current) {
        setDataList(response.data);
      }
    });
  }, [mounted, id, page, count]);

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
      <TableStatic
        header={[
          "bankRef",
          "createOn",
          "comment",
          "type",
          "amount",
        ]}
      >
        {dataList.items.map(function (item) {
          return (
            <>
              <TableRow hover key={item.id}>
                <TableCell>{item.bankRef}</TableCell>
                <TableCell>{toLocaleDateTime(item.date.date)}</TableCell>
                <TableCell>
                  <Typography
                    variant="contained"
                    color="success"
                    size={"small"}
                    sx={{
                      alignItems: "center",
                      display: "flex",
                    }}
                    onClick={() => {
                      dispatch(
                        showConfirm({
                          title: t("Comment show"),
                          text: item.comment,
                          isOpen: true,
                        })
                      );
                    }}
                  >
                    <Comment sx={{ marginRight: 1 }} />
                    {t("Comment show")}
                  </Typography>
                </TableCell>
                <TableCell>{item.type === "DEBIT" ? t("Debit operation"): t("Credit operation")}</TableCell>
                <TableCell>{item.amount}</TableCell>
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
  );
};

export default BankOperationList;
