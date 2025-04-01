import { CssBaseline, LinearProgress, ThemeProvider } from '@material-ui/core';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useRoutes } from 'react-router-dom';
import RTL from './components/RTL';
import SplashScreen from './components/SplashScreen';
import { gtmConfig } from './config';
import { useLoading } from './contexts/LoadingContext';
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
  const { isLoading } = useLoading();

  useScrollReset();

  useEffect(() => {
    gtm.initialize(gtmConfig);
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
        {isLoading && (
          <LinearProgress
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 10000
            }}
          />
        )}
        {auth.isInitialized ? content : <SplashScreen />}
      </RTL>
    </ThemeProvider>
  );
};

export default App;
