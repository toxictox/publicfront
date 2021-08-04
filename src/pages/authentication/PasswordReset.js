import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";
// import { PasswordResetJwt } from "@comp/authentication/password-reset";

import gtm from "../../lib/gtm";
import { useTranslation } from "react-i18next";

const PasswordReset = () => {
  const { t } = useTranslation();

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("Reset title")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 8,
            }}
          />
          <Card>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 4,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <div>
                  <Typography color="textPrimary" gutterBottom variant="h4">
                    {t("Reset title")}
                  </Typography>
                </div>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  mt: 3,
                }}
              >
                {/*<PasswordResetAmplify />*/}
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default PasswordReset;
