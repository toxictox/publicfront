import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  TablePagination,
  TableRow,
  TableCell,
  Button,
  Typography,
} from "@material-ui/core";
import { toLocaleDateTime } from "@lib/date";
import useMounted from "@hooks/useMounted";
import { showConfirm } from "@slices/dialog";
import { useDispatch } from "react-redux";
import { TableStatic } from "@comp/core/tables";
import { Comment } from "@material-ui/icons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";

const DepositHistory = ({ reload, action }) => {
  const mounted = useMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const [dataList, setDataList] = useState({
    data: [],
  });
  const [page, setPage] = useState(0);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/${action}/deposit/hist/${id}?page=${page}&count=${25}`)
        .then((response) => response.data);

      if (mounted.current) {
        setDataList(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, reload]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
    await axios
      .post(`${app.api}/${action}/deposit/hist/?page=${newPage}&count=${25}`)
      .then((response) => {
        setDataList(response.data);
      });
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const customHeader = [];
  if (action !== "bank") customHeader.push("name");

  return (
    <>
      <TableStatic
        header={[
          ...customHeader,
          "amount",
          "createOn",
          "action",
          "comment",
          "user",
        ]}
      >
        {dataList.data.map(function (item) {
          return (
            <>
              <TableRow hover key={item.id}>
                {action !== "bank" ? <TableCell>{item.bank}</TableCell> : null}

                <TableCell>{item.amount}</TableCell>
                <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>
                <TableCell>{item.action}</TableCell>
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
                <TableCell>{item.user}</TableCell>
              </TableRow>
            </>
          );
        })}
      </TableStatic>

      <TablePagination
        component="div"
        count={dataList.count}
        onPageChange={handlePageChange}
        page={page}
        rowsPerPage={25}
        rowsPerPageOptions={[25]}
      />
    </>
  );
};

export default DepositHistory;
