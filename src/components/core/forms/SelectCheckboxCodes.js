import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  OutlinedInput,
  FormControl,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { useTranslation } from "react-i18next";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const SelectCheckboxCodes = (props) => {
  const theme = useTheme();
  const {
    error,
    fieldText,
    label,
    name,
    onBlur,
    onChange,
    value,

    labelId,
    items,
  } = props;
  const { t } = useTranslation();

  const setRenderValue = () => {
    const arr = [];

    items.forEach((item) => {
      if (value.includes(item.id) && Array.isArray(fieldText)) {
        arr.push(`${item[fieldText[0]]} ${item[fieldText[1]]}`);
      } else if (value.includes(item.id)) {
        arr.push(t(item.name));
      }
    });
    return arr.join(",");
  };

  setRenderValue();
  return (
    <FormControl
      sx={{
        width: "100%",
      }}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        error={error}
        id={labelId}
        fullWidth
        select
        label={label}
        margin="normal"
        name={name}
        onBlur={onBlur}
        value={value}
        variant="outlined"
        size="small"
        renderValue={setRenderValue}
        onChange={(e) => {
          let data = [];
          if (e.target.value[e.target.value.length - 1] === "success") {
            items.forEach((item) =>
              item.internal >= 1000 && item.internal < 2000
                ? data.push(item.id)
                : null
            );
            onChange(data);
          } else if (e.target.value[e.target.value.length - 1] === "failed") {
            items.forEach((item) =>
              item.internal >= 2000 ? data.push(item.id) : null
            );
            onChange(data);
          } else {
            onChange(e.target.value);
          }
        }}
        sx={{ m: 0 }}
        MenuProps={MenuProps}
        input={<OutlinedInput label={label} />}
        multiple
      >
        {/*<Stack*/}
        {/*  direction="row"*/}
        {/*  sx={{*/}
        {/*    marginLeft: 3,*/}
        {/*    marginRight: 3,*/}
        {/*    marginTop: 2,*/}
        {/*  }}*/}
        {/*  spacing={1}*/}
        {/*>*/}
        {/*  <Typography*/}
        {/*    variant="caption"*/}
        {/*    display="block"*/}
        {/*    color={"green"}*/}
        {/*    onClick={() => {*/}
        {/*      let data = [];*/}
        {/*      items.forEach((item) =>*/}
        {/*        item.internal >= 1000 && item.internal < 2000*/}
        {/*          ? data.push(item.id)*/}
        {/*          : null*/}
        {/*      );*/}
        {/*      onChange(data);*/}
        {/*    }}*/}
        {/*    gutterBottom*/}
        {/*  >*/}
        {/*    {t("select success")}*/}
        {/*  </Typography>*/}
        {/*  <Typography*/}
        {/*    variant="caption"*/}
        {/*    color={"red"}*/}
        {/*    display="block"*/}
        {/*    onClick={() => {*/}
        {/*      let data = [];*/}
        {/*      items.forEach((item) =>*/}
        {/*        item.internal >= 2000 ? data.push(item.id) : null*/}
        {/*      );*/}
        {/*      onChange(data);*/}
        {/*    }}*/}
        {/*    gutterBottom*/}
        {/*  >*/}
        {/*    {t("select failed")}*/}
        {/*  </Typography>*/}
        {/*</Stack>*/}
        <MenuItem key={"success"} name={`field[${222}]`} value={"success"}>
          <Typography
            variant="caption"
            display="block"
            color={"green"}
            // onClick={() => {
            //   let data = [];
            //   items.forEach((item) =>
            //     item.internal >= 1000 && item.internal < 2000
            //       ? data.push(item.id)
            //       : null
            //   );
            //   onChange(data);
            // }}
            gutterBottom
          >
            {t("select success")}
          </Typography>
        </MenuItem>
        <MenuItem key={"failed"} name={`field[${111}]`} value={"failed"}>
          <Typography
            variant="caption"
            color={"red"}
            display="block"
            // onClick={() => {
            //   let data = [];
            //   items.forEach((item) =>
            //     item.internal >= 2000 ? data.push(item.id) : null
            //   );
            //   onChange(data);
            // }}
            gutterBottom
          >
            {t("select failed")}
          </Typography>
        </MenuItem>
        {items.map((item) => (
          <MenuItem
            key={item.id}
            name={`field[${item.id}]`}
            value={item.id}
            style={getStyles(item.id, value, theme)}
          >
            <Checkbox
              checked={value.includes(item.id)}
              name={`field[${item.id}]`}
              defaultChecked={value.includes(item.id)}
            />

            {Array.isArray(fieldText) ? (
              <ListItemText
                primary={`${item[fieldText[0]]} ${item[fieldText[1]]}`}
              />
            ) : (
              <ListItemText primary={t(item.name)} />
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SelectCheckboxCodes.defaultProps = {
  fieldText: null,
  onSelectChange: null,
};

export default SelectCheckboxCodes;
