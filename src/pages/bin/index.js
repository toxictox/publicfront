import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  CardHeader,
  Container,
  Divider,
  TableCell,
  TablePagination,
  TableRow,
  Card, Button, CardContent, Typography, CircularProgress,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";

import gtm from "@lib/gtm";
import { GetFilterDataFromStore, GetFilterPageFromStore } from "@lib/filter";

import axios from "@lib/axios";
import { app } from "@root/config";
import { useDispatch } from "@store";
import { setFilterPage } from "@slices/filter";
import { TableStatic } from "@comp/core/tables";
import { useTranslation } from "react-i18next";
import {GroupTable} from "@comp/core/buttons";
import toast from "react-hot-toast";
import useAuth from "@hooks/useAuth";

const TransactionsList = () => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const [dataList, setListData] = useState({
    data: [],
    count: 0,
  });

  const [page, setPage] = useState(GetFilterPageFromStore("bin"));
  const [count, setCount] = useState(25);
  const filterList = GetFilterDataFromStore("bin");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getAccess } = useAuth();

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const getBins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios
        .get(`${app.api}/bin/table?page=${page}&count=${count}`, filterList)
        .then((response) => response.data)
        .finally(() => [setLoading(false)]);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page, count]);

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
            `${app.api}/bin/import`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
        );
        toast.success(t('fileUploaded'));
        getBins();
      } catch (error) {
        toast.error(t('fileUploadError'));
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleActionCustom = async (event) => {
    const response = await axios.get(
        `${app.api}/bin/template`,
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

  const getActionCustom = () => {
    return [
      {
        title: t('downloadImportBinTemplate'),
        callback: () => handleActionCustom()
      }
    ];
  };

  const getActionExcelFileUpload = () => {
    return [
      {
        title: t('Upload file'),
        callback: handleFileUpload
      },
    ];
  };

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    dispatch(setFilterPage({ path: "bin", page: newPage }));
  };

  const handleRowsPerPageChange = async (e, newValue) => {
    setCount(newValue.props.value);
  };

  useEffect(() => {
    getBins();
  }, [getBins]);

  return (
    <>
      <Helmet>
        <title>{t("Bin List")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
          <Box sx={{ mt: 1 }}>
            <Card sx={{ mt: 1 }}>
              <CardHeader
                title={t("Bin List")}
                action={
                  <Box display="flex" alignItems="center">
                    {getAccess('bin', 'import') && (
                        <GroupTable
                            actionCustom={getActionCustom()}
                            actionExcelFileUpload={getActionExcelFileUpload()}
                        />
                    )}
                  </Box>
                }
              />
              <TableStatic
                header={[
                  "id",
                  "bin",
                  "bankName",
                  "countryName",
                  "countryCode",
                ]}
              >
                {loading &&
                    <CardContent>
                      <Typography>
                        <CircularProgress size={20} />
                        &nbsp;{t('loading')}
                      </Typography>
                    </CardContent>
                }
                {dataList.data.map(function (item) {
                  return (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.bin}</TableCell>
                      <TableCell>{item.bankName}</TableCell>
                      <TableCell>{item.countryName}</TableCell>
                      <TableCell>{item.countryCode}</TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
              <Divider />
            </Card>

            <TablePagination
              component="div"
              count={dataList.count}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={count}
              rowsPerPageOptions={[25, 50, 100]}
              labelRowsPerPage={t('rows_per_page')}
              labelDisplayedRows={({ from, to, count, page }) => {
                const labelFrom = t('from');
                const labelGreaterThan = t('greater_than');

                return `${from}-${to} ${labelFrom} ${count !== -1 ? count : `${labelGreaterThan} ${to}`}`;
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
