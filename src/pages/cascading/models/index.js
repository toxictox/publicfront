import { useCallback, useEffect, useState } from "react";
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
  TableCell,
  MenuItem,
  TextField,
} from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { TableStatic } from "@comp/core/tables";
import { GroupTable, CreateButton } from "@comp/core/buttons";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";

const CascadingModelsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dataList, setListData] = useState([]);
  const [merchantId, setMerchantId] = useState(0);
  const [merchant, setMerchant] = useState([]);
  const [page, setPage] = useState(0);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/merchants`)
        .then((response) => response.data.data);

      if (mounted.current) {
        setMerchant(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
    await axios
      .post(`${app.api}/cascade/models?page=${newPage}&count=${25}`)
      .then((response) => {
        setListData(response.data);
      });
  };

  const handleChange = async (e) => {
    setMerchantId(e.target.value);
    await axios
      .post(`${app.api}/cascade/models?page=${page}&count=${25}`, {
        merchantId: e.target.value,
      })
      .then((response) => setListData(response.data));
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <>
      <Helmet>
        <title>{t("Cascading Models List")}</title>
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
                title={t("Cascading Models List")}
                action={
                  <CreateButton
                    action={() =>
                      navigate("/cascading/create", {
                        state: {
                          priority: 20,
                        },
                      })
                    }
                    text={t("Create button")}
                  />
                }
              />

              <Divider />
              <Box sx={{ m: 2 }}>
                <TextField
                  fullWidth
                  label="gatewayId"
                  name="gatewayId"
                  onChange={handleChange}
                  select
                  size="small"
                  value={merchantId}
                  variant="outlined"
                >
                  <MenuItem key={-1} value={""}>
                    {t("Select value")}
                  </MenuItem>
                  {merchant.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <TableStatic
                header={["rule", "merchant", "gateway", "createOn", ""]}
              >
                {dataList.map(function (item) {
                  return (
                    <TableRow
                      hover
                      key={item.hash}
                      onClick={() => navigate(`/cascading/id/${item.id}`)}
                    >
                      <TableCell>
                        <Link
                          color="textLink"
                          component={RouterLink}
                          to={`/cascading/id/${item.id}`}
                          underline="none"
                          variant="subtitle2"
                        >
                          {item.rule}
                        </Link>
                      </TableCell>
                      <TableCell>{item.merchant}</TableCell>
                      <TableCell>{item.gateway}</TableCell>
                      <TableCell>{item.createOn}</TableCell>

                      <TableCell align={"right"}>
                        <GroupTable
                          actionView={() =>
                            navigate(`/cascading/id/${item.id}`)
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
              count={dataList.length}
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

export default CascadingModelsList;
