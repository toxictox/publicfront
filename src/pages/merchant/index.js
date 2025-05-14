import React, { useCallback, useEffect, useState } from "react";
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
import useAuth from "@hooks/useAuth";

const MerchantList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAccess } = useAuth();

  const [dataList, setDataList] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(25);

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  const handleChangeSwitch = async (e, id) => {
    await axios
      .patch(`${app.api}/merchant/status/${id}`, {
        status: Number(e.target.checked),
      })
      .then((response) => {
        toast.success(t("Success update"));

        setDataList({
          count: dataList.count,
          items: dataList.items.map((item) => {
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

  const getMerchants = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/merchants`, {
          params: {
            page: page + 1,
            count: count,
          }
        })
        .then((response) => response.data);

      if (mounted.current) {
        setDataList(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page, count]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    getMerchants();
  }, [getMerchants]);

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
                  <>
                    <GroupTable
                      actionCreate={{
                        callback: () => navigate("/merchants/create"),
                        access: getAccess("merchants", "create"),
                      }}
                    />
                  </>
                }
              />
              <Divider />
              <TableStatic
                header={[
                  "merchantName",
                  "description",
                  "createOn",
                  "editOn",
                  "status",
                  "",
                ]}
              >
                {dataList.items.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
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
                        {getAccess("merchants", "details") ? (
                          <GroupTable
                            actionView={() =>
                              navigate(`/merchants/id/${item.id}`)
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
              rowsPerPage={count}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MerchantList;
