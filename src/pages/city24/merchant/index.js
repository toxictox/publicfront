import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  TablePagination,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { toLocaleDateTime } from "@lib/date";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { TableStatic } from "@comp/core/tables";
import { GroupTable, CreateButton } from "@comp/core/buttons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useAuth from "@hooks/useAuth";

const MerchantsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAccess } = useAuth();

  const [dataList, setDataList] = useState({
    data: [],
    count: 0,
  });
  const [page, setPage] = useState(0);

  const handleChangeSwitch = async (e, id) => {
    await axios
      .patch(`${app.api}/merchant/status/${id}`, {
        status: Number(e.target.checked),
      })
      .then((response) => {
        toast.success(t("Success update"));

        setDataList({
          page: dataList.page,
          count: dataList.count,
          data: dataList.data.map((item) => {
            if (item.id === id) {
              item.status = e.target.checked ? false : true;
            }
            return item;
          }),
        });
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/merchants/city`, {
          params: {
            page: page,
            count: 25,
          },
        })
        .then((response) => response.data);

      if (mounted.current) {
        setDataList(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant List")}</title>
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
                title={t("Merchant List")}
                action={
                  getAccess("merchants", "create") ? (
                    <CreateButton
                      action={() => navigate("/city24/merchants/create")}
                      text={t("Create button")}
                    />
                  ) : null
                }
              />
              <Divider />
              <TableStatic header={["name", "accountNumber", "createOn", ""]}>
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.accountNumber}</TableCell>
                      <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>

                      <TableCell align={"right"}>
                        {getAccess("merchants", "details") ? (
                          <GroupTable
                            actionView={() =>
                              navigate(`/city24/merchants/id/${item.id}`)
                            }
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
            <TablePagination
              component="div"
              count={dataList.count}
              onPageChange={handlePageChange}
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

export default MerchantsList;
