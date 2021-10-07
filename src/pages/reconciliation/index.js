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
import ReconciliationFilter from "@comp/reconciliation/ReconciliationFilter";

const ReconciliationList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
              <CardHeader
                title={t("Reconciliation List")}
                action={
                  user.merchantId && bankId ? (
                    <CreateButton
                      action={() => navigate("/codes/create")}
                      text={t("Create button")}
                    />
                  ) : null
                }
              />
              <Divider />
              <ReconciliationFilter callback={updateData} />
              <Divider />
              <TableStatic
                header={[, "external", "langEn", "langRu", "langUk", ""]}
              >
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.external}</TableCell>
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
