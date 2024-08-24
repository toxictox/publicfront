import { useCallback, useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Grid,
  Container,
  Card,
  CardHeader,
  TableRow,
  TableBody,
  MenuItem,
  Typography,
  TextField,
  Divider,
} from "@material-ui/core";

import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";
import { TableStaticDrag } from "@comp/core/tables";
import { CreateButton } from "@comp/core/buttons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Item from "./Item";
import useAuth from "@hooks/useAuth";

const CascadingModelsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAccess } = useAuth();
  const [dataList, setListData] = useState([]);
  const [tranTypesId, setTranTypesId] = useState(0);
  const [tranTypes, setTranTypes] = useState([]);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .post(`${app.api}/cascade/tran_types`, {
          merchantId: localStorage.getItem('merchId'),
        })
        .then((response) => response.data);

      if (mounted.current) {
        setTranTypes(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, user.merchantId]);

  const handleChangeSwitch = (id, val) => {
    setListData(
      dataList.map((item) => {
        if (item.id === id) {
          item.status = val;
        }
        return item;
      })
    );
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    result.forEach((item, i) => {
      item.priority = i + 1;
    });

    return result;
  };

  const handlePriority = (items) => {
    const params = items.map((item) => {
      return {
        id: item.id,
        priority: item.priority,
      };
    });

    axios
      .patch(`${app.api}/cascade/models/priority`, {
        priority: params,
      })
      .then((s) => {
        toast.success(t("Success update"));
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      dataList,
      result.source.index,
      result.destination.index
    );

    handlePriority(items);

    setListData(items);
  };

  const handleChangeTranTypes = async (e) => {
    setTranTypesId(e.target.value);
    if (e.target.value !== 0 && e.target.value !== "") {
      await axios
        .post(`${app.api}/cascade/models`, {
          merchantId: localStorage.getItem('merchId'),
          tranTypeId: e.target.value,
        })
        .then((response) => setListData(response.data));
    } else {
      setListData([]);
    }
  };

  const handleRemoveItem = async (id) => {
    await axios
      .delete(`${app.api}/cascade/model/${id}`)
      .then((response) => {
        toast.success(t("Success deleted"));
        let newList = dataList.filter((item) => item.id !== id);
        if (newList.length !== 0) {
          setListData(reorder(newList));
          handlePriority(reorder(newList));
        } else {
          setListData(newList);
        }
      })
      .catch((e) => toast.error(e));
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
                  user.merchantId &&
                  tranTypesId !== undefined &&
                  tranTypesId !== 0 &&
                  getAccess("cascading", "create") ? (
                    <CreateButton
                      action={() =>
                        navigate("/cascading/create", {
                          state: {
                            merchantId: user.merchantId,
                            tranTypesId: tranTypesId,
                          },
                        })
                      }
                      text={t("Create button")}
                    />
                  ) : null
                }
              />
              <Divider />
              <Box m={2}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="tranTypesId"
                      name="tranTypesId"
                      onChange={handleChangeTranTypes}
                      select
                      size="small"
                      value={tranTypesId}
                      variant="outlined"
                    >
                      <MenuItem key={-1} value={""}>
                        {t("Select value")}
                      </MenuItem>
                      {tranTypes.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
              <TableStaticDrag
                header={[
                  "",
                  "priority",
                  "tranType",
                  "gateway",
                  "gatewayMethod",
                  "rule",
                  "status",
                  "",
                ]}
              >
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="list">
                    {(provided) => (
                      <TableBody
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {dataList.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                hover
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Item
                                  item={item}
                                  switchStatus={handleChangeSwitch}
                                  removeItem={() => handleRemoveItem(item.id)}
                                />
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </DragDropContext>
              </TableStaticDrag>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CascadingModelsList;
