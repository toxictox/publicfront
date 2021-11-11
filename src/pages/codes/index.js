import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  Link,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
  TablePagination,
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
import CodesFilter from "@comp/codes/CodesFilter";

const CodesList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataList, setListData] = useState({ data: [] });
  const [page, setPage] = useState(0);
  const [filterList, setFilterList] = useState({});
  const { user } = useAuth();

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .post(`${app.api}/codes?page=0&count=25`)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const filter = (values) => {
    handlePageChange(null, 0, values);
  };

  // const handlePageChange = async (e, newPage) => {
  //   setPage(newPage);
  //   await axios
  //     .post(`${app.api}/codes?page=${newPage}&count=${25}`)
  //     .then((response) => {
  //       setListData(response.data);
  //     });
  // };

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    await axios
      .post(
        `${app.api}/codes?page=${newPage}&count=${25}`,
        values !== undefined ? values : filterList
      )
      .then((response) => {
        setFilterList(values);
        setListData(response.data);
      });
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <>
      <Helmet>
        <title>{t("Codes List")}</title>
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
                title={t("Codes List")}
                action={
                  user.merchantId ? (
                    <CreateButton
                      action={() => navigate("/codes/create")}
                      text={t("Create button")}
                    />
                  ) : null
                }
              />
              <Divider />
              <CodesFilter callback={filter} />
              <Divider />
              <TableStatic
                header={[, "external", "langEn", "langRu", "langUk", ""]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell sx={{ color: item.color }}>
                        {item.external}
                      </TableCell>
                      <TableCell>{item.langEn}</TableCell>
                      <TableCell>{item.langRu}</TableCell>
                      <TableCell>{item.langUk}</TableCell>
                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() => navigate(`/codes/id/${item.id}`)}
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

export default CodesList;
