import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  TableRow,
  TableCell,
  CardHeader,
  Divider,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { TableStatic } from "@comp/core/tables/index";
import { GroupTable, BackButton } from "@comp/core/buttons";
import { toLocaleDateTime } from "@lib/date";

const UserId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState({
    data: [],
  });

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/user/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getItem();
  }, [getItem]);

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
          <BackButton action={() => navigate("/users")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("User Item")}
                action={
                  <GroupTable
                    actionUpdate={() => navigate(`/users/id/${id}/update`)}
                  />
                }
              />
              <Divider />
              <TableStatic>
                <TableRow>
                  <TableCell width={"50%"}>{t("firstName")}</TableCell>
                  <TableCell>{dataList.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("lastName")}</TableCell>
                  <TableCell>{dataList.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("email table")}</TableCell>
                  <TableCell>{dataList.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("phone")}</TableCell>
                  <TableCell>{dataList.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("hash")}</TableCell>
                  <TableCell>{dataList.hash}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("merchant")}</TableCell>
                  <TableCell>{dataList.merchantName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("lastLogin")}</TableCell>
                  <TableCell>
                    {dataList.lastLogin
                      ? toLocaleDateTime(dataList.lastLogin)
                      : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("loginTries")}</TableCell>
                  <TableCell>{dataList.loginTries}</TableCell>
                </TableRow>
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default UserId;
