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
  Card, Button,
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
  const filterList = GetFilterDataFromStore("bin");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const { getAccess } = useAuth();

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const response = await axios
        .get(`${app.api}/bin/table?page=${page}&count=${25}`, filterList)
        .then((response) => response.data);

      if (mounted.current) {
        setListData(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, page]);

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
        getOrders();
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

  const handlePageChange = async (e, newPage, values) => {
    setPage(newPage);
    dispatch(setFilterPage({ path: "bin", page: newPage }));
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

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
                    <GroupTable
                        actionCustom={getActionCustom()}
                    />
                    {getAccess('bin', 'import') ? (
                        <Button
                            variant="contained"
                            component="label"
                        >
                          {t('Upload file')}
                          <input accept=".xlsx" type="file" hidden onChange={handleFileUpload} />
                        </Button>
                    ) : null}
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
              page={page}
              rowsPerPage={25}
              rowsPerPageOptions={[25, 50, 100]}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TransactionsList;
