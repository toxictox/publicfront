import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { BackButton } from "@comp/core/buttons";
import { PhotoCamera } from "@material-ui/icons";
import axios from "@lib/axios";
import { app } from "@root/config";
import useSettings from "@hooks/useSettings";
import { useStyles } from "@comp/core/buttons/style/buttons.style";

const MerchantInvoicePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const classes = useStyles();
  const [ withPartnerAgreement, setWithPartnerAgreement ] = useState(false);
  const [ invoicePreview, setInvoicePreview ] = useState('');
    const { settings } = useSettings();

  const getPreview = () => {
    axios.get(`${app.api}/merchant/${id}/invoice`, {
        params: {
            withPartnerAgreement: withPartnerAgreement
        }
    }).then((reponse) => {
        setInvoicePreview(reponse.data);
    });
  };

  const handleChange = (e) => {
    setWithPartnerAgreement(e.target.checked);
    getPreview();
  };

  const uploadLogo = ({ target }) => {
    let formData = new FormData();
    formData.append('logo', target.files[0]);
    axios.post(`${app.api}/merchant/${id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    }).then(() => {
        getPreview();
    });
  };

  useEffect(() => {
    getPreview();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{t("Merchant invoice preview")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
            <BackButton action={() => navigate(`/merchants/id/${id}`)} />

            <Box sx={{ minWidth: 700 }}>
            <Card sx={{ mt: 2 }}>
              <CardHeader
                title={t("Merchant invoice preview")}
              />
              <Divider />
              <CardContent>
                <input
                    style={{ display: 'none' }}
                    accept="image/*"
                    id="logo-upload-button"
                    onChange={uploadLogo}
                    type="file"
                />
                <label htmlFor="logo-upload-button">
                    <IconButton
                      className={classes.button}
                        color="primary"
                        component="span"
                          variant="contained"
                    >
                        <PhotoCamera />{t('Upload Logo')}
                    </IconButton>
                </label>
                <FormGroup>
                    <FormControlLabel control={<Switch
                        checked={withPartnerAgreement}
                        onChange={handleChange}
                        name='withPartnerAgreement'
                    />} label={t('with partner agreement')} />
                </FormGroup>
                <iframe style={{ minHeight: 600, minWidth: '60%' }} srcDoc={invoicePreview} />
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default MerchantInvoicePreviewPage;
