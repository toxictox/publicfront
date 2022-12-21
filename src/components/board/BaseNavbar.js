import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import MenuIcon from '@icons/Menu';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import Logo from '@comp/LogoHeader';

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  }),
  zIndex: theme.zIndex.drawer + 100
}));

const BaseNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 50, alignItems: 'center' }}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none'
            }
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <RouterLink to="/board">
          <Logo />
        </RouterLink>
        <Box
          sx={{
            flexGrow: 1,
            ml: 1
          }}
        />
        <LanguagePopover />
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

BaseNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func
};

export default BaseNavbar;
