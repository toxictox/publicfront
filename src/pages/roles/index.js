import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
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

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { showConfirm } from "@slices/dialog";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import useAuth from "@hooks/useAuth";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [merchantId, setMerchantId] = useState(0);
  const [dataList, setListData] = useState({ roles: [] });
  const [page, setPage] = useState(0);
  const { user } = useAuth();

  const handleDelete = async (id) => {
    await axios
      .delete(`${app.api}/role/delete/${id}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        setListData(
          Object.assign({}, dataList, {
            roles: dataList.roles.filter((item) => item.roleId !== id),
          })
        );
      })
      .catch((e) => toast.error(t(e.response.data.message)));
  };

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .post(`${app.api}/role/get`, {
          merchantId: user.merchantId,
        })
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handleChangeMerchant = async (e) => {
    setMerchantId(e.target.value);
    if (e.target.value !== 0 && e.target.value !== "") {
      await axios
        .post(`${app.api}/role/get`, {
          merchantId: e.target.value,
        })
        .then((response) => setListData(response.data));
    } else {
      setListData({
        roles: [],
      });
    }
  };

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
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
        <title>{t("Roles List")}</title>
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
                title={t("Roles List")}
                action={
                  user.merchantId ? (
                    <CreateButton
                      action={() =>
                        navigate("/roles/create", {
                          state: {
                            merchantId: merchantId,
                          },
                        })
                      }
                      text={t("Create button")}
                    />
                  ) : null
                }
              />
              <Divider />

              <TableStatic header={["name", ""]}>
                {dataList.roles.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.roleName}</TableCell>
                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() =>
                            navigate(`/roles/id/${item.roleId}`)
                          }
                          actionDelete={() => {
                            dispatch(
                              showConfirm({
                                title: t("Do you want to remove"),
                                isOpen: true,
                                okCallback: () => handleDelete(item.roleId),
                              })
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
            {/*<TablePagination*/}
            {/*  component="div"*/}
            {/*  count={dataList.count}*/}
            {/*  onPageChange={handlePageChange}*/}
            {/*  page={page}*/}
            {/*  rowsPerPage={25}*/}
            {/*  rowsPerPageOptions={[25]}*/}
            {/*/>*/}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
