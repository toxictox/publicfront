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
  Chip,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import { TableStatic } from "@comp/core/tables/index";
import { GroupTable, BackButton } from "@comp/core/buttons";
import { showConfirm } from "@slices/dialog";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import useAuth from "@hooks/useAuth";
import { toLocaleDateTime } from "@lib/date";
const MerchantId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, getAccess } = useAuth();
  const [dataList, setListData] = useState({
    data: [],
  });
  const dispatch = useDispatch();
  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/merchant/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, id]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${app.api}/merchant/${id}`)
      .then(async (response) => {
        let newMerchId =
          user.merchants[0].merchantId !== id
            ? user.merchants[0].merchantId
            : user.merchants[1].merchantId;

        await axios
          .post(`${app.api}/user/${user.hash}`, {
            merchantId: newMerchId,
          })
          .then((response) => {
            localStorage.setItem("accessToken", response.data.token);
            localStorage.setItem("merchId", newMerchId);
            window.location.replace("/board");
          });
      })
      .catch((e) => toast.error(e));
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant Item Id")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate("/merchants")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Merchant Item Id")}
                action={
                  <GroupTable
                    actionUpdate={{
                      access: getAccess("merchants", "update"),
                      callback: () => navigate(`/merchants/id/${id}/update`),
                    }}
                    actionDelete={{
                      access: getAccess("merchants", "delete"),
                      callback: () => {
                        dispatch(
                          showConfirm({
                            title: t("Do you want to remove"),
                            isOpen: true,
                            okCallback: () => handleDelete(id),
                          })
                        );
                      },
                    }}
                    actionCustom={[
                      {
                        title: t("depositLimit"),
                        callback: () => navigate(`/merchants/deposit/${id}`),
                        access: getAccess("merchants", "depositLimitEdit"),
                      },
                      {
                        title: t("keyToken"),
                        callback: () => navigate(`/merchants/token/${id}`),
                        access: getAccess("merchants", "getMerchantKey"),
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
                      {i === "status" ? (
                        <TableCell>
                          {dataList[i] === true ? (
                            <Chip
                              label={"true"}
                              size={"small"}
                              color="success"
                            />
                          ) : (
                            <Chip
                              label={"false"}
                              size={"small"}
                              color="error"
                            />
                          )}
                        </TableCell>
                      ) : (
                        <TableCell>
                          {i === "createOn" || i === "editOn"
                            ? toLocaleDateTime(dataList[i])
                            : dataList[i]}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MerchantId;
