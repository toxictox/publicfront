import { Button, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function ButtonWithLoader(props) {
  const {
    loaded,
    textOnLoad = 'Loading',
    textBeforeLoaded = 'Upload file',
  } = props;
  console.log(props);
  const { t } = useTranslation();
  return (
    <Button variant="contained" disabled={!Boolean(loaded)} component="span">
      {t(Boolean(loaded) ? textBeforeLoaded : textOnLoad)}
      {Boolean(loaded) || <CircularProgress color="inherit" size={20} />}
    </Button>
  );
}
