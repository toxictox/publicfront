import React from 'react';
import { TableStatic } from '@comp/core/tables';
import {
  Box,
  Container,
  Card,
  CardHeader,
  Divider,
  TableRow,
  TableCell,
  Button
} from '@material-ui/core';
import useSettings from '@hooks/useSettings';
import { useTranslation } from 'react-i18next';
import axios from '@lib/axios';
import { app } from '@root/config';
import { getCsvFileHelper } from '@utils/getCsvFileHelper';

const ExportCity24Docs = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [city24List, setCity24List] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${app.api}/export/city`)
      .then((res) => {
        const { data } = res;
        setCity24List(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const buttonClickHandler = (fileName) => {
    axios
      .get(`${app.api}/export/city/${fileName}`, { responseType: 'blob' })
      .then((res) => {
        const { data, headers } = res;
        getCsvFileHelper({ data, headers });
      })
      .catch((error) => console.log(error));
  };

  return (
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
            <CardHeader title={t('City24 Files List')} />
            <Divider />
            <TableStatic>
              {city24List.map(function (item, idx) {
                return (
                  <TableRow hover key={item}>
                    <TableCell>{idx}</TableCell>
                    <TableCell>{item}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant={'contained'}
                        size={'small'}
                        onClick={() => {
                          buttonClickHandler(item);
                        }}
                      >
                        {t('Download File')}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableStatic>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ExportCity24Docs;
