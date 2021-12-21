import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
  Switch,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import DepositForm from "./_form";
import toast from "react-hot-toast";
import { BackButton, GroupTable } from "@comp/core/buttons";
import DepositHistory from "@comp/history/_history";
import { TableStatic } from "@comp/core/tables";

const Update = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState([]);
  const [tab, setTab] = useState({});
  const [reload, setReload] = useState(false);

  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/merchant/deposit/${id}`)
        .then((response) => response.data.data.deposits);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const openTab = (id, action) => {
    setTab({
      id: id,
      action: action,
    });
  };

  const handleChangeSwitch = async (e, bankId) => {
    await axios
      .patch(`${app.api}/merchant/deposit/status/${id}`, {
        status: Number(e.target.checked),
        bankId: bankId,
        action: !e.target.checked ? "Switch on" : "Switch off",
      })
      .then((response) => {
        const newData = dataList.map((item) => {
          if (item.bankId === bankId) {
            item.status = !e.target.checked;
            return item;
          }

          return item;
        });
        setListData(newData);
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleSubmit = async (values) => {
    try {
      await axios
        .patch(`${app.api}/merchant/deposit/${id}`, { ...values })
        .then((response) => {
          toast.success(t("Success update"));
          setListData(
            dataList.map((item) => {
              if (item.bankId === values.bankId) {
                item.depositLimit = response.data.data.deposits.depositLimit;
              }

              return item;
            })
          );
          setTab({
            id: null,
            action: null,
          });

          setReload(response.data.data.deposits);
        });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    getItem();
  }, [getItem]);
  return (
    <>
      <Helmet>
        <title>{t("Merchant Deposit Update")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/merchants/id/${id}`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Merchant Deposit Update")} />
              <Divider />
              <TableStatic
                header={["id", "bankName", "depositLimit", "status", ""]}
              >
                {dataList.map(function (item) {
                  return (
                    <>
                      <TableRow hover key={item.bankId}>
                        <TableCell width={30}>{item.bankId}</TableCell>
                        <TableCell width={200}>{item.bankName}</TableCell>
                        <TableCell>{item.depositLimit}</TableCell>
                        <TableCell>
                          <Switch
                            checked={item.status}
                            onChange={(e) => handleChangeSwitch(e, item.bankId)}
                            name={`check[${item.bankId}]`}
                            inputProps={{
                              "aria-label": "secondary checkbox",
                            }}
                          />
                        </TableCell>

                        <TableCell align={"right"}>
                          <GroupTable
                            actionCustom={[
                              {
                                title: t("Set deposit limit"),
                                color:
                                  tab.action === "set" && item.bankId === tab.id
                                    ? "success"
                                    : "primary",
                                callback: () => openTab(item.bankId, "set"),
                              },
                              {
                                title: t("Increase deposit limit"),
                                color:
                                  tab.action === "increase" &&
                                  item.bankId === tab.id
                                    ? "success"
                                    : "primary",
                                callback: () =>
                                  openTab(item.bankId, "increase"),
                              },
                              {
                                title: t("Decrease deposit limit"),
                                color:
                                  tab.action === "decrease" &&
                                  item.bankId === tab.id
                                    ? "success"
                                    : "primary",
                                callback: () =>
                                  openTab(item.bankId, "decrease"),
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                      {item.bankId === tab.id ? (
                        <TableRow hover key={item.bankId}>
                          <TableCell colSpan={4}>
                            <DepositForm
                              limit={item.depositLimit}
                              bankId={item.bankId}
                              cb={handleSubmit}
                              action={tab.action}
                              cancel={() => openTab(null, null)}
                            />
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </>
                  );
                })}
              </TableStatic>
            </Card>
          </Box>

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Merchant Deposit History")} />
              <Divider />
              <DepositHistory reload={reload} action={"merchant"} />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Update;
