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
import { toLocaleDateTime } from "@lib/date";
import useAuth from "@hooks/useAuth";

const TerminalId = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState({
    data: [],
  });
  const dispatch = useDispatch();
  const getItem = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/terminal/city/${id}`)
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
      .delete(`${app.api}/terminal/city/${id}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        navigate("/terminals/city");
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
          <BackButton action={() => navigate("/terminals/city")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Terminal Item Id")}
                action={
                  <GroupTable
                    actionUpdate={{
                      access: getAccess("terminals", "update"),
                      callback: () =>
                        navigate(`/terminals/city/id/${id}/update`),
                    }}
                    actionDelete={{
                      access: getAccess("terminals", "delete"),
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
              </TableStatic>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TerminalId;
