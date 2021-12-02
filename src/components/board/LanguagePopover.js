import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MenuItem, TextField } from "@material-ui/core";
import { useStyles } from "./styles/lang.style";
// import { KeyboardArrowDown } from "@material-ui/icons";

const LanguagePopover = () => {
  const lang = localStorage.getItem("i18nextLng");
  const { i18n } = useTranslation();
  const [value, setValue] = useState(lang !== null ? lang : "en");
  const classes = useStyles();
  const handleChangeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    setValue(e.target.value);
  };

  return (
    <TextField
      select
      onChange={handleChangeLanguage}
      className={classes.root}
      margin="normal"
      name="tranTypeId"
      type="text"
      value={value}
      variant="outlined"
      size="small"
      // SelectProps={{
      //   IconComponent: () => <KeyboardArrowDown />,
      // }}
    >
      <MenuItem value={"ru"}>Ru</MenuItem>
      <MenuItem value={"ua"}>Ua</MenuItem>
      <MenuItem value={"en"}>En</MenuItem>
    </TextField>
  );
};

export default LanguagePopover;
