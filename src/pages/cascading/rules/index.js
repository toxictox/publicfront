import { useCallback, useEffect, useState, useMemo } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  TablePagination,
  Card,
  Link,
  CardHeader,
  Divider,
  TableRow,
  Dialog,
  TableCell,
} from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { TableStatic } from "@comp/core/tables";
import { GroupTable, CreateButton } from "@comp/core/buttons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";

const CascadingRulesList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dataList, setListData] = useState({
    data: [],
  });
  const [page, setPage] = useState(0);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/cascade/rules?page=${page}&count=${25}`)
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
    await axios
      .post(`${app.api}/cascade/rules?page=${newPage}&count=${25}`)
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
        <title>{t("Cascading Rules List")}</title>
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
                title={t("Cascading Rules List")}
                action={
                  <CreateButton
                    action={() => navigate("/cascading/rules/create")}
                    text={t("Create button")}
                  />
                }
              />
              <Divider />
              <TableStatic header={["name", "namespace", "createOn", ""]}>
                {dataList.data.map(function (item) {
                  return (
                    <TableRow
                      hover
                      key={item.hash}
                      onClick={() => navigate(`/cascading/rules/id/${item.id}`)}
                    >
                      <TableCell>
                        <Link
                          color="textLink"
                          component={RouterLink}
                          to={`/cascading/rules/id/${item.id}`}
                          underline="none"
                          variant="subtitle2"
                        >
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell>{item.namespace}</TableCell>
                      <TableCell>{item.createOn}</TableCell>

                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() =>
                            navigate(`/cascading/rules/id/${item.id}`)
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

export default CascadingRulesList;
