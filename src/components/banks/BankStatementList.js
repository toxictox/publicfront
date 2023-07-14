import { useCallback, useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import {red, green, blue} from '@material-ui/core/colors';

import {
  TablePagination,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Tooltip,
  Toolbar
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

import DownloadIcon from '@material-ui/icons/Download';
import UploadStatementForm from "./UploadStatementForm";


const BankStatementList = ({ reload, bankId }) => {
  const { user, getAccess } = useAuth();

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

  const statusColors = {
    done: green[800],
    pending: blue[800],
    loaded: blue[800],
    failed: red[800],
  };

  const getOperations = useCallback(async () => {
    axios.get(`${app.api}/bank/${bankId}/statement`, {
      params: {
        page: page + 1,
        count: count,
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
      <Toolbar>
        <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {t("Bank statements")}
        </Typography>
        {getAccess('statements', 'upload') ? (
          <UploadStatementForm bankId={bankId} onUpload={getOperations} />
        ) : null}
      </Toolbar>
      <TableStatic
        header={[
            "createOn",
            "status",
            "result",
            "createdBy"
        ]}
      >
        {dataList.items.map(function (item) {
          return (
            <>
              <TableRow hover key={item.id}>
                <TableCell>{toLocaleDateTime(item.createdOn.date)}</TableCell>
                <TableCell><Typography color={statusColors[item.status]} >{t("Status " + item.status)}</Typography></TableCell>
                <TableCell>
                  {item.result.length ? (
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
                            title: t("Result show"),
                            text: item.result,
                            isOpen: true,
                          })
                        );
                      }}
                    >
                      <Comment sx={{ marginRight: 1 }} />
                      {t("Result show")}
                    </Typography>
                  ) : (
                    t("No result")
                  )}
                </TableCell>
                <TableCell>{item.createdBy}</TableCell>
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

export default BankStatementList;
