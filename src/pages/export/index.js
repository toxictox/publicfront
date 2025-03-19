import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  CardHeader,
  Container,
  Card,
  Divider,
  TableRow,
  TableCell,
  Button,
  Typography
} from '@material-ui/core';
import useSettings from '@hooks/useSettings';
import { useTranslation } from 'react-i18next';
import gtm from '../../lib/gtm';
import { ExportFileFilter } from '@comp/export';
import axios from '@lib/axios';
import { app } from '@root/config';
import { getCsvFileHelper } from '@utils/getCsvFileHelper';
import { TableStatic } from '@comp/core/tables';
import { red, green, blue } from '@material-ui/core/colors';
import toast from 'react-hot-toast';

const ExportList = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [filterList, setFilterList] = useState({});
  const [generatedReports, setGeneratedReports] = useState([]);

  useEffect(() => {
    axios.get(`${app.api}/report/task/list`).then((res) => {
      const { data } = res;
      if (data) {
        setGeneratedReports(data);
      }
    });
  }, [filterList]);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  // const getFilesByID = (fileId) =>
  //   axios
  //     .get(`${app.api}/report/${fileId}`, { responseType: 'blob' })
  //     .then((res) => {
  //       const { data, headers } = res;
  //       getCsvFileHelper({ data, headers });
  //     });

  const getFileByLink = (linkUrl) => {
    window.open(linkUrl, '_blank', 'noopener,noreferrer');
  };

  const createFile = async (reportPath, values) => {
    await axios
      .post(
        `${app.api}/report/${reportPath}`,
        values !== undefined ? values : filterList,
        {
          responseType: 'blob'
        }
      )
      // .then((response) => {
      //   const { data } = response;
      //   return getFilesByID(data.id);
      // })
      .then(() => {
        setFilterList(values);
      })
      .catch((err) => {
        const reader = new FileReader();
        const blob = err.response.data;

        reader.onload = function () {
          toast.error(t(JSON.parse(reader.result).message));
        };

        reader.readAsText(blob);
      });
  };

  const buttonClickHandler = (link) => {
    getFileByLink(link);
  };

  const statuses =  {
    1: 'status_new',
    2: 'status_processing',
    3: 'status_finished',
    4: 'status_failed',
  };

  const statusColors = {
    1: blue[800],
    2: blue[800],
    3: green[800],
    4: red[800],
  };

  return (
    <>
      <Helmet>
        <title>{t('Export List')}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 2
        }}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Box sx={{ mt: 1 }}>
            <Card sx={{ mt: 1 }}>
              <CardHeader title={t('Export List')} />
              <ExportFileFilter callback={createFile} />
              <CardHeader title={t('generated_reports_list')} />
              <Divider></Divider>
              <TableStatic
                header={[
                  "id",
                  "filename",
                  "status",
                  "createdAt",
                  "generation duration",
                  "createdBy",
                  "",
                ]}
              >
                {generatedReports.map(function (report, idx) {
                  return (
                    <TableRow hover key={report.id}>
                      <TableCell>{idx}</TableCell>
                      <TableCell>{report.fileName}</TableCell>
                      <TableCell>
                        <Typography color={statusColors[report.status]}>
                          {t(statuses[report.status])}
                        </Typography>
                      </TableCell>
                      <TableCell>{report.createdAat}</TableCell>
                      <TableCell>{report.time}</TableCell>
                      <TableCell>{report.createdBy}</TableCell>
                      <TableCell align="right">
                        <Button
                          type="button"
                          variant={'contained'}
                          disabled={report.status != 3}
                          size={'small'}
                          onClick={(e) => {
                            e.stopPropagation();
                            buttonClickHandler(report.link);
                          }}
                        >
                          {t('Download File')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableStatic>
              <Divider sx={{ paddingBottom: '20px' }}></Divider>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ExportList;
