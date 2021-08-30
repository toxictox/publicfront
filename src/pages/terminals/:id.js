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
import { showConfirm } from "@slices/dialog";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";

const BankId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dataList, setListData] = useState({
    data: [],
  });
  const dispatch = useDispatch();
  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/terminal/${id}`)
        .then((response) => response.data);
      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${app.api}/terminal/${id}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        navigate("/terminals");
      })
      .catch((e) => toast.error(e));
  };

  useEffect(() => {
    getItem();
  }, [getItem]);

  return (
    <>
      <Helmet>
        <title>{t("Terminal Item Id")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate("/terminals")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Terminal Item Id")}
                action={
                  <GroupTable
                    actionUpdate={() => navigate(`/terminals/id/${id}/update`)}
                    actionDelete={() => {
                      dispatch(
                        showConfirm({
                          title: t("Do you want to remove"),
                          isOpen: true,
                          okCallback: () => handleDelete(id),
                        })
                      );
                    }}
                    actionCustom={[
                      {
                        title: t("keyToken"),
                        callback: () => navigate(`/terminals/token/${id}`),
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
                      <TableCell>{dataList[i]}</TableCell>
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

export default BankId;
