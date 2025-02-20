import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  CardHeader,
  Container,
  Divider,
  TableCell,
  TablePagination,
  TableRow,
  Card,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";

import gtm from "@lib/gtm";
import { GetFilterDataFromStore, GetFilterPageFromStore } from "@lib/filter";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useDispatch } from "@store";
import { setFilterPage } from "@slices/filter";
import { TableStatic } from "@comp/core/tables";
import { useTranslation } from "react-i18next";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    data: [],
    count: 0,
  });

  const [page, setPage] = useState(GetFilterPageFromStore("bin"));
  const filterList = GetFilterDataFromStore("bin");
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/bin/table?page=${page}&count=${25}`, filterList)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page]);

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    dispatch(setFilterPage({ path: "bin", page: newPage }));
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <>
      <Helmet>
        <title>{t("Bin List")}</title>
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
              <CardHeader title={t("Bin List")} />
              <TableStatic
                header={[
                  "id",
                  "bin",
                  "bankName",
                  "countryName",
                  "countryCode",
                ]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.bin}</TableCell>
                      <TableCell>{item.bankName}</TableCell>
                      <TableCell>{item.countryName}</TableCell>
                      <TableCell>{item.countryCode}</TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
              <Divider />
            </Card>

            <TablePagination
              component="div"
              count={dataList.count}
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={25}
              rowsPerPageOptions={[25, 50, 100]}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
