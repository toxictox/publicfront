import {GroupTable} from '@comp/core/buttons';
import {TableStatic} from '@comp/core/tables';
import CreateGiveoutModal from '@comp/manualGiveout/CreateGiveoutModal';
import useAuth from '@hooks/useAuth';
import useSettings from '@hooks/useSettings';
import axios from '@lib/axios';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  TableCell,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import {blue, green, red} from '@material-ui/core/colors';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {app} from '@root/config';
import {useCallback, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet-async';
import toast from 'react-hot-toast';
import {useTranslation} from 'react-i18next';

const ManualGiveoutIndex = () => {
  const { user } = useAuth();
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [isManualGiveoutReportDownloading, setManualGiveoutDownloadReport] =
    useState(false);
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [dataList, setDataList] = useState({
    items: [],
    count: 0
  });
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(50);
  const { getAccess } = useAuth();

  const [isModalFormOpen, setModalFormOpen] = useState(false);
  const [editableItem, setEditableItem] = useState(null);
  const [filter, setFilter] = useState({});

  const openForm = (item) => {
    setModalFormOpen(true);
    setEditableItem(item);
  };

  const closeForm = () => {
    setModalFormOpen(false);
    setEditableItem(null);
  };

  const fetchManualGiveouts = useCallback(async () => {
    axios
      .get(`${app.api}/manual/giveout`, {
        params: {
          page: page + 1,
          count: count,
          ...filter
        }
      })
      .then((response) => {
        setDataList(response.data);
      });
  }, [page, count, filter]);

  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [downloadingReportId, setDownloadingReportId] = useState(null);

  const updateManualGiveoutStatus = async (manualGiveoutId, currentStatus) => {
    setLoadingStatusId(manualGiveoutId);
    setIsStatusLoading(true);
    const response = await axios.get(
      `${app.api}/manual/giveout/${manualGiveoutId}/status`
    );

    if (response.data.status !== currentStatus) {
      const updatedList = dataList?.items
        ? dataList.items.map((item) =>
            item.id === manualGiveoutId
              ? { ...item, status: response.data.status }
              : item
          )
        : [];

      setDataList((prevState) => ({
        ...prevState,
        items: updatedList
      }));
    }

    setIsStatusLoading(false);
    setLoadingStatusId(null);
  };

  const handlePageChange = async (e, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  const statuses = {
    1: 'status_new',
    2: 'status_processing',
    3: 'status_finished',
    4: 'status_failed'
  };

  const availableStatusesForUpdate = [1, 2];

  const statusColors = {
    1: blue[800],
    2: blue[800],
    3: green[800],
    4: red[800]
  };

  const downloadReportClickHandler = async (manualGiveoutId) => {
    setDownloadingReportId(manualGiveoutId);
    setManualGiveoutDownloadReport(true);
    const response = await axios.post(
      `${app.api}/manual/giveout/${manualGiveoutId}/report/create`,
        {},
        {
          responseType: 'blob'
        }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    let filename = 'file.xlsx';
    const contentDisposition = response.headers['content-disposition'];

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setManualGiveoutDownloadReport(false);
    setDownloadingReportId(null);
  };

  const getActionCustom = () => {
    return [
      {
        title: t('downloadManualGiveoutTemplate'),
        callback: () => handleActionCustom()
      }
    ];
  };

  useEffect(() => {
    fetchManualGiveouts();
  }, [fetchManualGiveouts]);

  const [isUploading, setIsUploading] = useState(false);

  const handleActionCustom = async (event) => {
    const response = await axios.get(
        `${app.api}/manual/giveout/file/template`,
        {
          responseType: 'blob'
        }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    let filename = 'file.xlsx';
    const contentDisposition = response.headers['content-disposition'];

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
      try {
        const response = await axios.post(
          `${app.api}/manual/giveout/file`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        toast.success(t('fileUploaded'));
        fetchManualGiveouts();
      } catch (error) {
        toast.error(t('fileUploadError'));
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('manualGiveoutList')}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
        {isUploading && <LinearProgress />}
          <CreateGiveoutModal
            open={isModalFormOpen}
            onClose={closeForm}
            entity={editableItem}
            onUpdate={fetchManualGiveouts}
          />

          <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t('manualGiveoutList')}
                action={
                  <Box display="flex" alignItems="center">
                    <GroupTable
                        actionCreate={{
                          access: getAccess('manualGiveout', 'create'),
                          callback: () => {
                            openForm(null);
                          }
                        }}
                        actionCustom={getActionCustom()}
                    />
                    <input
                        accept=".xlsx"
                        style={{display: 'none'}}
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                      <IconButton color="primary" component="span">
                        <CloudUploadIcon/>
                      </IconButton>
                    </label>
                  </Box>
                }
              />
              <Divider/>
              <TableStatic
                  header={[
                    'id',
                    'merchantName',
                    'status',
                    'manual_giveout_user_created_email',
                    'actions'
                  ]}
              >
                {dataList.items.map(function (item) {
                  return (
                      <>
                        <TableRow hover key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.merchantName}</TableCell>
                        <TableCell>
                          <Typography color={statusColors[item.status]}>
                            {t(statuses[item.status])}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.userCreatedEmail}</TableCell>
                        <TableCell align="left">
                          {availableStatusesForUpdate.includes(item.status) && (
                            <Button
                              type="button"
                              variant={'contained'}
                              disabled={isStatusLoading && loadingStatusId === item.id}
                              size={'small'}
                              sx={{
                                marginRight:'10px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateManualGiveoutStatus(item.id, item.status);
                              }}
                            >
                              {isStatusLoading && loadingStatusId === item.id && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <CircularProgress size={20} />
                                </Box>
                              )}
                              {t('Update Status')}
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant={'contained'}
                            disabled={
                              item.status !== 3 ||
                              (isManualGiveoutReportDownloading && downloadingReportId === item.id)
                            }
                            size={'small'}
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadReportClickHandler(item.id);
                            }}
                          >
                            {isManualGiveoutReportDownloading && downloadingReportId === item.id && (
                              <Box
                                id={item.id}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                              >
                                <CircularProgress id={item.id} size={20} />
                              </Box>
                            )}
                            {t('Create Manual Giveout Report')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableStatic>

              <TablePagination
                count={-1}
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

export default ManualGiveoutIndex;
