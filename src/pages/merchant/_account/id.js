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
import { useDispatch } from "react-redux";
import useAuth from "@hooks/useAuth";
import { toLocaleDateTime } from "@lib/date";
import OperationsList from "@comp/merchant/account/OperationsList";


const AccountId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { merchantId, accountId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, getAccess } = useAuth();
  const [ account, setAccount ] = useState({
  });
  const [dataList, setListData] = useState({
    data: [],
  });
  const dispatch = useDispatch();

  const getItem = useCallback(async () => {
    const response = await axios
    .get(`${app.api}/merchant/${merchantId}/account/${accountId}`)
    .then((response) => setAccount(response.data))
    .catch((err) => {
        if (err.response.status === 404) {
            navigate("*");
        }
    });
  }, [mounted, merchantId, accountId]);

  const formatAmount = (number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'KZT' }).format(number);
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant Account")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/merchants/${merchantId}/account/`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Merchant Account Item")}
                action={
                  <GroupTable
                    actionUpdate={{
                      access: getAccess("merchants", "update"),
                      callback: () => navigate(`/merchants/id/${merchantId}/update`),
                    }}
                  />
                }
              />
              <Divider />
              <TableStatic>
                <TableRow>
                    <TableCell>{t("Id")}</TableCell>
                    <TableCell>{account.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Name")}</TableCell>
                  <TableCell>{account.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Balance")}</TableCell>
                  <TableCell>{formatAmount(account.balance / 100)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Overdarft Limit")}</TableCell>
                  <TableCell>{formatAmount(account.overdraftLimit / 100)}</TableCell>
                </TableRow>
              </TableStatic>
            </Card>
          </Box>
        </Container>
        <OperationsList
            accountId={accountId}
            merchantId={merchantId}
        />
      </Box>
    </>
  );
};

export default AccountId;
