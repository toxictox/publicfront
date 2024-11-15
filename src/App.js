import { setLoaderHandler } from '@lib/axios';
import { CssBaseline, LinearProgress, ThemeProvider } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useRoutes } from 'react-router-dom';
import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { gtmConfig } from './config';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import './i18n';
import gtm from './lib/gtm';
import routes from './routes';
import { createCustomTheme } from './theme';

const App = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  useScrollReset();

  useEffect(() => {
    gtm.initialize(gtmConfig);
    setLoaderHandler(setLoading);
  }, []);

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme
  });

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={settings.direction}>
        <CssBaseline />
        <Toaster position="top-center" />
        {loading && <LinearProgress />}
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  );
};

export default App;
