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
import DepositForm from "@pages/merchant/_deposit/_form";
import toast from "react-hot-toast";
import DepositHistory from "@comp/history/_history";
import useAuth from "@hooks/useAuth";
import BankOperationList from "@comp/banks/BankOperationList";
const BankId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [reload, setReload] = useState(false);
  const { getAccess } = useAuth();
  const [tab, setTab] = useState({
    open: false,
    action: null,
  });
  const [dataList, setListData] = useState({
    data: [],
  });

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/bank/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, id]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  const handleSubmit = async (values) => {
    try {
      await axios
        .patch(`${app.api}/bank/deposit/${id}`, { ...values })
        .then((response) => {
          toast.success(t("Success update"));
          setListData({
            ...dataList,
            depositLimit: response.data.depositLimit,
          });

          setTab({
            open: false,
            action: null,
          });

          setReload(response.data);
        });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const openTab = (id, action) => {
    setTab({
      open: id,
      action: action,
    });
  };

  return (
    <>
      <Helmet>
        <title>{t("Banks Item Id")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate("/banks")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Banks Item Id")}
                action={
                  <GroupTable
                    actionUpdate={() => navigate(`/banks/id/${id}/update`)}
                    // actionDelete={() => console.log("delete action")}
                    actionCustom={[
                      {
                        title: t("Set deposit limit"),
                        access: getAccess("banks", "updateBankDeposit"),
                        color: tab.action === "set" ? "success" : "primary",
                        callback: () => openTab(true, "set"),
                      },
                      {
                        title: t("Increase deposit limit"),
                        access: getAccess("banks", "updateBankDeposit"),
                        color:
                          tab.action === "increase" ? "success" : "primary",
                        callback: () => openTab(true, "increase"),
                      },
                      {
                        title: t("Decrease deposit limit"),
                        access: getAccess("banks", "updateBankDeposit"),
                        color:
                          tab.action === "decrease" ? "success" : "primary",
                        callback: () => openTab(true, "decrease"),
                      },
                    ]}
                  />
                }
              />
              <Divider />
              <TableStatic>
                {Object.keys(dataList).map(function (i, index) {
                  return (
                    <TableRow key={i}>
                      <TableCell>{t(i)}</TableCell>
                      <TableCell>
                        {i === "editOn" || i === "createOn"
                          ? toLocaleDateTime(dataList[i])
                          : dataList[i]}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {tab.open ? (
                  <TableRow key={dataList.id}>
                    <TableCell colSpan={4}>
                      <DepositForm
                        limit={dataList.depositLimit}
                        bankId={id}
                        cb={handleSubmit}
                        action={tab.action}
                        cancel={() => openTab(false, null)}
                      />
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableStatic>
            </Card>
          </Box>

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Bank Deposit History")} />
              <Divider />
              <DepositHistory reload={reload} action={"bank"} />
            </Card>
          </Box>

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Bank Operations")} />
              <Divider />
              <BankOperationList reload={reload} bankId={id} />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default BankId;
