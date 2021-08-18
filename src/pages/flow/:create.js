import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  Grid,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import Scrollbar from "@comp/board/Scrollbar";
import toast from "react-hot-toast";
import { BackButton, GroupTable } from "@comp/core/buttons";
import ReactFlow, {
  addEdge,
  removeElements,
  ReactFlowProvider,
  Background,
} from "react-flow-renderer";
import nodeTypes from "@comp/flow/nodes";
import TitleFlowForm from "@comp/flow/forms";
import { useStyles } from "@comp/flow/styles/elements.style";

const initialElements = [
  {
    id: `${Date.now()}`,
    tranType: "start",
    type: "start", // input node
    data: { label: "Start Node" },
    position: { x: 250, y: 5 },
  },
];

const FlowCreate = () => {
  const mounted = useMounted();
  const [elements, setElements] = useState(initialElements);
  const [connect, setConnent] = useState([]);
  const [title, setTitle] = useState("");
  const [types, setTypes] = useState([]);
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const classes = useStyles();

  const onElementsRemove = (elementsToRemove) => {
    setElements((els) => removeElements(elementsToRemove, els));
    setConnent((els) => removeElements(elementsToRemove, els));
  };

  const onLoad = (reactFlowInstance) => reactFlowInstance.fitView();

  const onConnect = (params, e) => {
    return setConnent((els) =>
      addEdge({ ...params, className: classes.edge }, els)
    );
  };

  const onNodeDragStop = (e, n) => {
    let newCoords = elements.map((item) => {
      if (item.id === n.id) {
        return {
          ...n,
          tranType: item.tranType,
        };
      }

      return item;
    });

    setElements(newCoords);
  };

  const getTypes = useCallback(async () => {
    try {
      let flow;
      const response = await axios
        .get(`${app.api}/methods`)
        .then((response) => response.data);

      if (state !== null && state.id !== undefined && state.id !== "") {
        flow = await axios
          .get(`${app.api}/get_flow/${state.id}`)
          .then((response) => response.data);
      }

      if (mounted.current) {
        setTypes(response.data);
      }

      if (flow) {
        setTitle(`${flow.flowName}_copy`);
        setConnent(flow.connect);
        setElements(flow.elements);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted]);

  useEffect(() => {
    getTypes();
  }, [getTypes]);

  const OnAdd = (title) => {
    const newNode = {
      id: `${Date.now()}`,
      data: {
        label: title,
      },
      tranType: title,
      type: "node3",
      position: {
        x: 60,
        y: 60,
      },
    };
    setElements((els) => {
      return [newNode, ...els];
    });
  };

  const handleClear = () => {
    setElements([elements[elements.length - 1]]); // save only main node
    setConnent([]);
  };

  const handleSubmit = async (values) => {
    try {
      await axios
        .post(`${app.api}/post_flow`, {
          flowName: title,
          elements: elements,
          connect: connect,
        })
        .then((response) => {
          toast.success(t("Success update"));
          navigate(`/flow`);
        });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("Transactions Flow Create")}</title>
      </Helmet>
      <Box
        sx={{
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <BackButton action={() => navigate(`/flow`)} />
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Transactions Flow Create")}
                action={
                  <GroupTable
                    actionCustom={[
                      {
                        title: t("Save button"),
                        callback: handleSubmit,
                      },
                    ]}
                  />
                }
              />
              <Divider />
              <CardContent>
                <TitleFlowForm
                  callback={(title) => setTitle(title)}
                  data={title}
                />
              </CardContent>
            </Card>
            <Grid container>
              <Grid item xs={3} className={classes.aside}>
                <Scrollbar options={{ suppressScrollX: true }}>
                  <List component="nav" aria-label="main mailbox folders">
                    {types.map((item) => (
                      <ListItem
                        key={item.id}
                        className={classes.li}
                        onClick={() => OnAdd(item.name)}
                        button
                      >
                        <ListItemText primary={item.name} />
                      </ListItem>
                    ))}
                  </List>
                </Scrollbar>
              </Grid>
              <Grid item xs={9}>
                <Box className={classes.flow}>
                  <ReactFlowProvider>
                    <ReactFlow
                      elements={[...elements, ...connect]}
                      nodeTypes={nodeTypes}
                      onLoad={null}
                      onNodeDragStop={onNodeDragStop}
                      onElementsRemove={onElementsRemove}
                      onConnect={onConnect}
                      snapToGrid={true}
                      deleteKeyCode={46}
                      key="edge-with-button"
                    >
                      <Background />
                    </ReactFlow>
                  </ReactFlowProvider>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default FlowCreate;
