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

const CascadingModelId = () => {
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
        .get(`${app.api}/cascade/model/${id}`)
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
        <title>{t("Gateway Item")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate("/cascading")} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader title={t("Gateway Item")} />
              <Divider />
              <TableStatic>
                {Object.keys(dataList).map(function (i, index) {
                  return (
                    <TableRow key={i}>
                      {i === "status" ? (
                        <>
                          <TableCell>{t(i)}</TableCell>
                          <TableCell>{dataList[i].toString()}</TableCell>
                        </>
                      ) : i == "ruleCondition" ? (
                        <>
                          <TableCell>{t(i)}</TableCell>
                          <TableCell>
                            {dataList[i].map((item) => (
                              <p>
                                {item.ruleCond} {item.ruleValue}
                              </p>
                            ))}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{t(i)}</TableCell>
                          <TableCell>{dataList[i].toString()}</TableCell>
                        </>
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

export default CascadingModelId;
