import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Container } from '@material-ui/core';
import { TwoFactorAuth as TwoFactorAuthComponent } from '@comp/authentication/two-factor';
import gtm from '@lib/gtm';
import { useTranslation } from 'react-i18next';

const TwoFactorAuthPage = () => {
    const { t } = useTranslation();

    useEffect(() => {
        gtm.push({ event: 'page_view' });
    }, []);

    return (
        <>
            <Helmet>
                <title>{t('Two-Factor Authentication')}</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh'
                }}
            >
                <Container maxWidth="sm" sx={{ py: '80px' }}>
                    <TwoFactorAuthComponent />
                </Container>
            </Box>
        </>
    );
};

export default TwoFactorAuthPage;