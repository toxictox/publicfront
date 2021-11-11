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
  Switch,
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

const TerminalsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dataList, setDataList] = useState({
    data: [],
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
        .get(`${app.api}/merchants?page=${page}&count=${25}`)
        .then((response) => response.data);

      if (mounted.current) {
        setDataList(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
    await axios
      .post(`${app.api}/merchants?page=${newPage}&count=${25}`)
      .then((response) => {
        setDataList(response.data);
      });
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
                  <CreateButton
                    action={() => navigate("/merchants/create")}
                    text={t("Create button")}
                  />
                }
              />
              <Divider />
              <TableStatic
                header={[
                  "name",
                  "description",
                  "createOn",
                  "editOn",
                  "status",
                  "",
                ]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.hash}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{toLocaleDateTime(item.createOn)}</TableCell>
                      <TableCell>{toLocaleDateTime(item.editOn)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.status}
                          onChange={(e) => handleChangeSwitch(e, item.id)}
                          name={`check[${item.id}]`}
                          inputProps={{
                            "aria-label": "secondary checkbox",
                          }}
                        />
                      </TableCell>

                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() =>
                            navigate(`/merchants/id/${item.id}`)
                          }
                        />
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

export default TerminalsList;
