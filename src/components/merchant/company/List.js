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

  const getCompanies = useCallback(async () => {
    axios.get(`${app.api}/company`, {
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

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);


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
          <ModalForm
            merchantId={merchantId}
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={getCompanies}
          />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Companies")}
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
                      "id",
                      "name",
                      "companyEmail",
                      "companyIin",
                      "companyBankAccountNumber",
                      "",
                    ]}
                  >
                    {dataList.items.map(function (item) {
                      return (
                        <>
                          <TableRow hover key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.companyEmail}</TableCell>
                            <TableCell>{item.iin}</TableCell>
                            <TableCell>{item.bankAccountNumber}</TableCell>
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
                    {t('NoCompaniesDefined', "No companies has been defined yet. Add your first company")}&nbsp;
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
