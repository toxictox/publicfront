import {
  Button,
  Dialog,
  DialogActions,
  DialogContent
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} BackdropProps={{ invisible: true }}>
      <DialogContent>{t('Do you want to remove')}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant='outlined'>
          {t('Cancel button')}
        </Button>
        <Button onClick={onConfirm} color="primary" variant='contained'>
          {t('Apply button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
