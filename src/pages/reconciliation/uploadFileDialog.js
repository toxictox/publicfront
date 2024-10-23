import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { uploadFile } from './helper';

const UploadFileDialog = ({ open, onClose, jobs }) => {
  const { t } = useTranslation();
  const [selectedBank, setSelectedBank] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedBank('');
      setFile(null);
    }
  }, [open]);

  const handleChange = (event) => {
    setSelectedBank(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedBank) {
      return;
    }
    try {
      await uploadFile(file, selectedBank);
      toast.success('File upload');
    } catch (error) {
      toast.error('error');
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={'400px'}>
      <DialogTitle>{t('Upload Files')}</DialogTitle>
      <DialogContent>
          <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
            <InputLabel>{t('Reconciliation type')}</InputLabel>
            <Select
              value={selectedBank}
              onChange={handleChange}
              label={t('Reconciliation type')}
            >
              {jobs.items?.map((bank) => (
                <MenuItem key={bank.uid} value={bank.uid}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            component="label"
            sx={{ marginTop: 2, width: '100%' }}
          >
            {t('Upload file')}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('Cancel button')}
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          disabled={!file || !selectedBank}
        >
          {t('Apply button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadFileDialog;
