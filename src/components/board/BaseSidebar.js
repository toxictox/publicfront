import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  MenuItem,
  TextField,
  Typography,
  Grid,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import NavSection from "./NavSection";
import Scrollbar from "./Scrollbar";
import { useTranslation } from "react-i18next";
import {
  Group,
  Receipt,
  AccountBalance,
  Timeline,
  CenterFocusWeak,
  LinearScale,
  Home,
  BlurLinear,
  Storefront,
  Security,
  PriceCheck,
  DescriptionOutlined,
  Code,
  Dns,
} from "@material-ui/icons";

import useAuth from "@hooks/useAuth";
import axios from "@lib/axios";
import { app } from "@root/config";

const BaseSidebar = (props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [merchId, setMerchId] = useState(
    localStorage.getItem("merchId") !== null
      ? localStorage.getItem("merchId")
      : user.merchantId
  );

  const [balance, setBalance] = useState({
    balance: 0,
  });

  const getActiveStatus = (name) => {
    return user.permissions[name] !== undefined;
  };
  const sections = [
    {
      title: "",
      items: [
        {
          title: t("Dashboard menu"),
          path: "/board",
          icon: <Home fontSize="small" />,
          active: true,
        },
        {
          title: t("Transaction menu"),
          path: "/transactions",
          icon: <Receipt fontSize="small" />,
          active: getActiveStatus("transactions"),
        },
        {
          title: t("Users menu"),
          path: "/users",
          icon: <Group fontSize="small" />,
          active: getActiveStatus("users"),
          children: [
            {
              title: t("Users active menu"),
              path: "/users",
              icon: <Group fontSize="small" />,
              active: getActiveStatus("users"),
            },
            {
              title: t("Users inactive menu"),
              path: "/users/inactive",
              icon: <Group fontSize="small" />,
              active: getActiveStatus("users"),
            },
          ],
        },
        {
          title: t("Role menu"),
          path: "/roles",
          icon: <Security fontSize="small" />,
          active: getActiveStatus("roles"),
        },
        {
          title: t("Banks menu"),
          path: "/banks",
          icon: <AccountBalance fontSize="small" />,
          active: getActiveStatus("banks"),
        },
        {
          title: t("Flow menu"),
          path: "/flows",
          icon: <Timeline fontSize="small" />,
          active: getActiveStatus("flows"),
        },
        {
          title: t("Gateway menu"),
          path: "/gateways",
          icon: <CenterFocusWeak fontSize="small" />,
          active: getActiveStatus("gateways"),
        },
        {
          title: t("Cascading menu"),
          path: "/cascading",
          icon: <LinearScale fontSize="small" />,
          active: getActiveStatus("cascading"),
        },
        {
          title: t("Terminals menu"),
          path: "/terminals",
          icon: <BlurLinear fontSize="small" />,
          active: getActiveStatus("terminals"),
        },
        {
          title: t("Merchant menu"),
          path: "/merchants",
          icon: <Storefront fontSize="small" />,
          active: getActiveStatus("merchants"),
        },
        {
          title: t("Reconciliation menu"),
          path: "/reconciliation",
          icon: <PriceCheck fontSize="small" />,
          active: getActiveStatus("reconciliation"),
        },
        {
          title: t("Description menu"),
          path: "/export",
          icon: <DescriptionOutlined fontSize="small" />,
          active: getActiveStatus("export"),
        },
        {
          title: t("Bin menu"),
          path: "/bin",
          icon: <Dns fontSize="small" />,
          active: getActiveStatus("bin"),
        },
        {
          title: t("Codes menu"),
          path: "/codes",
          icon: <Code fontSize="small" />,
          active: getActiveStatus("codes"),
        },
      ],
    },
  ];
  const { onMobileClose, openMobile } = props;
  const location = useLocation();

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleChangeMerch = async (e) => {
    localStorage.setItem("merchId", e.target.value);
    setMerchId(e.target.value);
    await axios
      .post(`${app.api}/user/${user.hash}`, {
        merchantId: e.target.value,
      })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.token);
        window.location.replace("/board");
      });
  };

  useEffect(() => {
    const getData = async () => {
      if (openMobile && onMobileClose) {
        await onMobileClose();
      }
    };
    getData();
  }, [location.pathname]);

  useEffect(() => {
    const getBalance = async () => {
      await axios
        .get(`${app.api}/board/depositBalance`)
        .then((response) => {
          setBalance(response.data);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    getBalance();
  }, []);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ p: 2 }}>
          <Box>
            <TextField
              fullWidth
              label="merchId"
              onChange={handleChangeMerch}
              select
              size="small"
              value={merchId}
              variant="outlined"
            >
              {user.merchants.map((item) => {
                return (
                  <MenuItem value={item.merchantId} key={item.merchantId}>
                    {item.merchantName}
                  </MenuItem>
                );
              })}
              ))}
            </TextField>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ paddingY: 1, paddingX: 3, marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle1" gutterBottom component="div">
                {t("Balance")}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                sx={{ textAlign: "right" }}
              >
                {balance.balance} {"\u20B4"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => {
            return (
              <NavSection
                key={section.title}
                pathname={location.pathname}
                sx={{
                  "& + &": {
                    mt: 3,
                  },
                }}
                {...section}
              />
            );
          })}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        //open
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            height: "calc(100% - 64px) !important",
            top: "64px !Important",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          width: 280,
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

BaseSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default BaseSidebar;
