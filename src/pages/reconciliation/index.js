import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
  TablePagination,
} from "@material-ui/core";

import useSettings from "@hooks/useSettings";
import { TableStatic } from "@comp/core/tables";
import { GroupTable } from "@comp/core/buttons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import useAuth from "@hooks/useAuth";
import ReconciliationFilter from "@comp/reconciliation/ReconciliationFilter";

const ReconciliationList = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();

  const [dataList, setListData] = useState({ data: [] });
  const [page, setPage] = useState(0);
  const [filterList, setFilterList] = useState({});
  const [bankId, setBankId] = useState(null);
  const { user } = useAuth();

  const updateData = async (values) => {
    await setBankId(values);
    await handlePageChange(null, 0, { bankId: values });
  };

  const handlePageChange = async (e, newPage, values) => {
    // setPage(newPage);
    // await axios
    //   .post(
    //     `${app.api}/codes?page=${newPage}&count=${25}`,
    //     values !== undefined ? values : filterList
    //   )
    //   .then((response) => {
    //     setFilterList(values);
    //     setListData(response.data);
    //   });
  };

  return (
    <>
      <Helmet>
        <title>{t("Reconciliation List")}</title>
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
              <CardHeader title={t("Reconciliation List")} />
              <Divider />
              <ReconciliationFilter callback={updateData} />
              <Divider />
              <TableStatic
                header={[
                  "id",
                  "create_on",
                  "update_on",
                  "total_count",
                  "success_count",
                  "failed_count",
                  "status",
                ]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.create_on}</TableCell>
                      <TableCell>{item.update_on}</TableCell>
                      <TableCell>{item.total_count}</TableCell>
                      <TableCell>{item.success_count}</TableCell>
                      <TableCell>{item.failed_count}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() => alert("check status")} //navigate(`/codes/id/${item.id}`)
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
            {dataList.count ? (
              <TablePagination
                component="div"
                count={dataList.count}
                onPageChange={handlePageChange}
                page={page}
                rowsPerPage={25}
                rowsPerPageOptions={[25]}
              />
            ) : null}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ReconciliationList;
