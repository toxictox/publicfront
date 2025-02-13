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
  IconButton,
} from "@material-ui/core";

import { toLocaleDateTime } from "@lib/date";
import useMounted from "@hooks/useMounted";
import { useDispatch } from "react-redux";
import { TableStatic } from "@comp/core/tables";
import useAuth from "@hooks/useAuth";
import { showConfirm } from "@slices/dialog";
import { toast } from "react-hot-toast";
import useSettings from "@hooks/useSettings";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { BackButton, GroupTable } from "@comp/core/buttons";
import ModalForm from "./ModalForm";
import { AddCircle } from "@material-ui/icons";

const List = ({ reload, merchantId }) => {
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
  const { getAccess } = useAuth();
  const navigate = useNavigate();

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);
  const { settings } = useSettings();

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  const getRules = useCallback(async () => {
    axios.get(`${app.api}/merchant/${merchantId}/fee/`, {
      params: {
        page: page + 1,
        count: count,
      }
    }).then((response) => {
      if (mounted.current) {
        setDataList(response.data);
      }
    });
  }, [mounted, merchantId, page, count]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  const handleDelete = async (id) => {
    await axios
      .delete(`${app.api}/merchant/${merchantId}/fee/${id}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        getRules();
      })
      .catch((e) => toast.error(t(e.response.data.message)));
  };

  useEffect(() => {
    getRules();
  }, [getRules]);


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
          <BackButton action={() => navigate(`/merchants/id/${merchantId}`)} />
          <ModalForm
            merchantId={merchantId}
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={getRules}
          />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Merchant fee rules")}
                action={
                  <GroupTable
                    actionCreate={{
                      access: getAccess("merchants", "update"),
                      callback: () => {
                        openForm(null);
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
                      "priority",
                      "tranType",
                      "terminal",
                      "min",
                      "max",
                      "strategy",
                      "value",
                      "minValue",
                      "startDate",
                      "endDate",
                      "merchantFeePercent",
                      "",
                    ]}
                  >
                    {dataList.items.map(function (item) {
                      return (
                        <>
                          <TableRow hover key={item.id}>
                            <TableCell>{item.priority}</TableCell>
                            <TableCell>{item.tranTypeName}</TableCell>
                            <TableCell>{item.terminalName}</TableCell>
                            <TableCell>{item.min}</TableCell>
                            <TableCell>{item.max}</TableCell>
                            <TableCell>{item.strategyName}</TableCell>
                            <TableCell>{item.value}</TableCell>
                            <TableCell>{item.minValue}</TableCell>
                            <TableCell>{item.startDate ? toLocaleDateTime(item.startDate) : t('No start date restrictions')}</TableCell>
                            <TableCell>{item.endDate ? toLocaleDateTime(item.endDate) : t('No end date restrictions')}</TableCell>
                            <TableCell>{item.merchantFeePercent}&nbsp;&#37;</TableCell>
                            <TableCell
                              align="right"
                              className="static-table__table-cell"
                            >
                              {getAccess("merchants", "update") ? (
                                <>
                                  <GroupTable
                                    actionView={() => {
                                      openForm(item);
                                    }}
                                    actionDelete={
                                      () => {
                                        dispatch(
                                          showConfirm({
                                            title: t("Do you want to remove"),
                                            isOpen: true,
                                            okCallback: () => handleDelete(item.id),
                                          })
                                        );
                                      }
                                    }
                                  />
                                </>
                              ) : null}
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
                </>
                :
                <CardContent>
                  <Typography>
                    {t('NoFeeRulesDefined', "No fee rules has been defined for this merchant yet. Add your first rule")}&nbsp;
                    <IconButton
                      type="button"
                      color="primary"
                      size="small"
                      onClick={() => {
                        openForm(null);
                      }}
                    >
                      <AddCircle />
                    </IconButton>
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

export default List;
