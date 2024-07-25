import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import axios from '@lib/axios';
import { TableStatic } from '@comp/core/tables/index';
import { useTranslation } from 'react-i18next';
import { app } from "@root/config";

const HoldersList = ({transactionId}) => {
  const { t } = useTranslation();
  const [holders, setHolders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchHolders();
  }, [transactionId]);


  const fetchHolders = () => {
    setLoading(true);
    axios.get(`${app.api}/transaction/${transactionId}/holders`
    ).then((response) => {
      setHolders(response.data);
    }).finally(function () {
      setLoading(false);
    });
  };

  return (
    <>
    <Card sx={{ mt: 2 }}>
      <CardHeader
        title={t('Card holders')}
      />
        <Divider />
        {loading &&
        <CardContent>
          <Typography>
            {t('Loading')}
          </Typography>
        </CardContent>
        }
        {!loading && !holders &&
          <CardContent>
            <Typography>
              {t('Empty')}
            </Typography>
          </CardContent>
        }
        {!loading && holders &&
          <TableStatic>
            {holders.map(function (value) {
                return (
                  <TableRow key={value}>
                    <TableCell>
                      {value}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableStatic>
        }
      </Card>
    </>
  );
};

export default HoldersList;
