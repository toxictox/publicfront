import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Typography } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import gtm from "../lib/gtm";

const ForbiddenRequest = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Helmet>
        <title>Доступ запрещен</title>
      </Helmet>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "background.paper",
          display: "flex",
          minHeight: "100%",
          px: 3,
          py: "80px",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            color="textPrimary"
            variant={mobileDevice ? "h4" : "h1"}
          >
            Доступ запрещен
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            sx={{ mt: 0.5 }}
            variant="subtitle2"
          >
            У вас нет прав на просмотр данного раздела
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Box
              alt="Under development"
              component="img"
              src={`/static/error/error401_${theme.palette.mode}.svg`}
              sx={{
                height: "auto",
                maxWidth: "100%",
                width: 400,
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ForbiddenRequest;
