import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Container, TablePagination } from "@material-ui/core";

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
  const [filterList, setFilterList] = useState({});
  const [page, setPage] = useState(0);

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

  const filter = (values) => {
    handlePageChange(null, 0, values);
  };

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    await axios
      .post(
        `${app.api}/transactions?page=${newPage}&count=${25}`,
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
            <TransactionListTable data={dataList.data} callback={filter} />
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
