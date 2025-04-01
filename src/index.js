import { LoadingProvider } from '@contexts/LoadingContext';
import { CircularProgress } from '@material-ui/core';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import 'nprogress/nprogress.css';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { HelmetProvider } from 'react-helmet-async';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-quill/dist/quill.snow.css';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/JWTContext';
import { SettingsProvider } from './contexts/SettingsContext';
import store from './store';

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SettingsProvider>
              <BrowserRouter>
                <Suspense fallback={<CircularProgress />}>
                  <AuthProvider>
                    <LoadingProvider>
                      <App />
                    </LoadingProvider>
                  </AuthProvider>
                </Suspense>
              </BrowserRouter>
            </SettingsProvider>
          </LocalizationProvider>
        </StyledEngineProvider>
      </ReduxProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById('root')
);
