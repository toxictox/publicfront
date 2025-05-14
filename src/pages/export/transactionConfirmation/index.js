import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Divider, IconButton, LinearProgress, makeStyles, Modal, TableCell, TablePagination, TableRow, Typography } from '@material-ui/core';
import { getFileHelper } from '@utils/getCsvFileHelper';
import useMounted from '@hooks/useMounted';
import useSettings from '@hooks/useSettings';

import axios from '@lib/axios';
import { app } from '@root/config';
import { TableStatic } from '@comp/core/tables';
import { useTranslation } from 'react-i18next';
import TransactionConfirmationModal from '@comp/transaction/TransactionConfirmationModal';
import MoreMenu from '@comp/MoreMenu';
import toast from 'react-hot-toast';
import useAuth from '@hooks/useAuth';
import { AddCircle, Cancel } from '@material-ui/icons';
import {
  Download
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5]
  },
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const TansactionConfirmationList = () => {
  const mounted = useMounted();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    items: [],
    count: 0,
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [merchId] = useState(
    localStorage.getItem('merchId') !== null
      ? localStorage.getItem('merchId')
      : user.merchantId
  );
  const [fileUploadModalIsOpen, setFileUploadModalIsOpen] = useState(false);
  const [downloadList, setDownloadList] = useState([]);
  const classes = useStyles();

  function FileUploadModal(props) {
    return (
      <>
        <IconButton
          type="button"
          color="primary"
          onClick={() => { setFileUploadModalIsOpen(true) }}
        >
          <AddCircle />
        </IconButton>
        <Modal
          open={fileUploadModalIsOpen}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className={classes.modal}
          onClose={() => { setFileUploadModalIsOpen(false) }}
        >
          <Card className={classes.paper}>
            <CardHeader title={t('transaction_confirmation.create_from_file', 'Create from file')} />
            <CardContent>
              <Typography variant='h6'>
                {t('transaction_confirmation.file_example', 'File example')}
              </Typography>
              <Typography>
                "transactionId1", transactionid2, transactionid3
              </Typography>
              <Button
                component="label"
                variant={"contained"}
                size={"small"}
              >
                {t('Upload file')}
                <input accept=".csv" hidden type="file" onChange={handleFileUpload} />
              </Button>
            </CardContent>
          </Card>
        </Modal>
      </>
    );
  }

  useEffect(() => {
    const intervalCall = setInterval(() => {
      getItems();
    }, 10000);
    getItems();
    return () => {
      clearInterval(intervalCall);
    };
  }, []);

  const downloadFile = async (id) => {
    setDownloadList((state) => ({
      ...state,
      [id]: 0
    }));
    await axios
      .get(`${app.api}/merchant/${merchId}/document/transaction/confirmation/${id}/download`, {
        responseType: 'blob',
        onDownloadProgress: progressEvent => {
          const total = progressEvent.total;
          const current = progressEvent.loaded;

          let percentCompleted = Math.floor(current / total * 100);
          setDownloadList((state) => ({
            ...state,
            [id]: percentCompleted
          }));
        }
      })
      .then((res) => {
        const { data, headers } = res;
        getFileHelper(data, headers, 'file.zip');
      })
      .finally(() => {
        setDownloadList((state) => ({
          ...state,
          [id]: undefined
        }));
      })
      ;
  };

  const cancelFile = async (id) => {
    await axios.post(`${app.api}/merchant/${merchId}/document/transaction/confirmation/${id}/cancel`)
    .then(getItems);
  }

  const getItems = useCallback(async () => {
    await axios
      .get(`${app.api}/merchant/${merchId}/document/transaction/confirmation/`,
        {
          params: {
            page: page + 1,
            count: count,
          }
        }
      )
      .then((response) => {
        setLoading(false);
        setListData(response.data);
      });
  }, [mounted, count, page]);

  const handlePageChange = async (e, newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setLoading(true);
    setCount(newValue.props.value);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSize = file.size;
      if (fileSize > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5 МБ');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      setIsUploading(true);
      axios.post(
        `${app.api}/merchant/${merchId}/document/transaction/confirmation/file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then((response) => {
        toast.success(t('fileUploaded'));
      }).catch((error) => {
        toast.error(t('fileUploadError'));
      }).finally(() => {
        setIsUploading(false);
        getItems();
      });
    }
    setFileUploadModalIsOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>{t("Transaction confirmations")}</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Transaction confirmations")}
              />
              <Divider />
              <CardHeader avatar={<TransactionConfirmationModal />} action={<MoreMenu />} title={t('Create')} />
              <CardHeader avatar={<FileUploadModal />} action={<MoreMenu />} title={t('transaction_confirmation.create_from_file', 'Create from file')} />
              <Divider />

              <TableStatic
                header={[
                  "date",
                  "status",
                ]}
              >
                {loading ?
                  <CardContent>
                    <Typography>
                      <CircularProgress />
                      {t('loading')}
                    </Typography>
                  </CardContent>
                  :
                  dataList.items.length > 0 ?
                    dataList.items.map(function (item) {
                      return (
                        <TableRow hover key={item.id}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            {item.status == 'ready' &&
                              <>
                                {downloadList[item.id] == undefined ?
                                  <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => downloadFile(item.id)}
                                    endIcon={<Download />}
                                  >
                                    {t(`transaction_confirmation.status.${item.status}`, item.status)}
                                  </Button>
                                  :
                                  <CircularProgress variant="determinate" value={downloadList[item.id]} />
                                }
                              </>
                            }
                            {item.status == 'canceled' ?
                                <>
                                  {t(`transaction_confirmation.status.${item.status}`, item.status)}&nbsp;
                                </>
                              :
                              <>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => cancelFile(item.id)}
                                  endIcon={<Cancel />}
                                >
                                  {t(`Cancel`)}
                                </Button>
                                {t(`transaction_confirmation.status.${item.status}`, item.status)}&nbsp;
                                <LinearProgressWithLabel value={Math.floor(item.processed / item.total * 100)} />
                              </>
                            }
                          </TableCell>
                        </TableRow>
                      );
                    })
                    :
                    <CardContent>
                      <Typography>
                        {t('No items', "No items")}
                      </Typography>
                    </CardContent>
                }
              </TableStatic>

              <TablePagination
                count={dataList.count}
                onPageChange={handlePageChange}
                page={page}
                rowsPerPage={count}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
              />
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TansactionConfirmationList;
