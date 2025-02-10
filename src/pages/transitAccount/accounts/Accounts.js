import { Button, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router'

export const Accounts = ({ accounts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    navigate(`/transit-account/statement/${id}`);
  };

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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleRedirect(account.id)}
                >
                  {t('View Statement')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
