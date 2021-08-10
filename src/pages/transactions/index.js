import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  TablePagination,
  Grid,
  Card,
  Link,
  Typography,
} from "@material-ui/core";
// import { orderApi } from "../../__fakeApi__/orderApi";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
// import ChevronRightIcon from "../../icons/ChevronRight";
// import DownloadIcon from "../../icons/Download";
// import UploadIcon from "../../icons/Upload";
// import PlusIcon from "../../icons/Plus";
import gtm from "../../lib/gtm";
import { TransactionListTable } from "@comp/transaction";

import axios from "@lib/axios";
import { app } from "@root/config";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    data: [],
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .post(`${app.api}/transactions?page=${page}&count=${25}`)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
    //getOrders();
    await axios
      .post(`${app.api}/transactions?page=${newPage}&count=${25}`)
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
        <title>Transactions List</title>
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
            <TransactionListTable data={dataList.data} />
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

export default TransactionsList;
