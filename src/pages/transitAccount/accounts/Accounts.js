import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const Accounts = ({ accounts }) => {
  const { t } = useTranslation();

  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        {accounts.items?.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card>
              <CardContent>
							<Typography variant="h6" component="div">
                 {t('Transit Account')} : {account?.id}
                </Typography>
                <Typography variant="h6" component="div">
                  {account?.name}
                </Typography>
                <Typography color="textSecondary">
                  {t('Balance')}: {account?.balance.toLocaleString()}
                </Typography>
                <Typography color="textSecondary">
                  {t('transport')}: {account?.transport}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
