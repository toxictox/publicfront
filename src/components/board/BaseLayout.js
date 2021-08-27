import { useState } from "react";
import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core/styles";
import BaseNavbar from "./BaseNavbar";
import BaseSidebar from "./BaseSidebar";
import ErrorBoundary from "@comp/core/errors/ErrorBoundary";
import { AlertDialog } from "@comp/core/dialog";

const DashboardLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const DashboardLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: "64px",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: "280px",
  },
}));

const DashboardLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const DashboardLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
  position: "relative",
  WebkitOverflowScrolling: "touch",
});

const BaseLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  return (
    <DashboardLayoutRoot>
      <BaseNavbar onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />
      <BaseSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />

      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
      <AlertDialog />
    </DashboardLayoutRoot>
  );
};

export default BaseLayout;
