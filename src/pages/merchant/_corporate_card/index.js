import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import List from "@comp/merchant/corporateCard/List";

const MerchantFeeRuleIndex = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("Corporate cards")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <List merchantId={id} />
      </Box>
    </>
  );
};

export default MerchantFeeRuleIndex;
