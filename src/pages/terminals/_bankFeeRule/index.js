import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Box,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import List from "@comp/terminals/bankFeeRules/List";

const BankFeeRuleIndex = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("Terminal fee rules")}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 2,
        }}
      >
        <List terminalId={id} />
      </Box>
    </>
  );
};

export default BankFeeRuleIndex;
