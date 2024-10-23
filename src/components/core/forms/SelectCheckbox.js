import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  OutlinedInput,
  FormControl,
  Chip,
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

const SelectCheckbox = (props) => {
  const theme = useTheme();
  const {
    error,
    fieldText,
    label,
    name,
    onBlur,
    onChange,
    value,
    onSelectAll,
    labelId,
    items,
    disabled,
  } = props;
  const { t } = useTranslation();

  const setRenderValue = () => {
    const arr = [];

    items.forEach((item) => {
      if (
        fieldText != null &&
        value.includes(item.id) &&
        Array.isArray(fieldText)
      ) {
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
        // margin="normal"
        name={name}
        onBlur={onBlur}
        value={value}
        variant="outlined"
        size="small"
        renderValue={setRenderValue}
        sx={{ m: 0 }}
        MenuProps={MenuProps}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        multiple
        disabled={disabled}
      >
        {onSelectAll !== null ? (
          <Chip
            label={t("select all value")}
            onClick={() => {
              onSelectAll(items.map((item) => item.id));
            }}
            variant="outlined"
            sx={{
              marginLeft: 3,
              marginTop: 1,
            }}
          />
        ) : null}

        {items.map((item) => (
          <MenuItem
            key={item.id}
            value={item.id}
            style={getStyles(item.id, value, theme)}
          >
            <Checkbox
              checked={value.includes(item.id)}
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

SelectCheckbox.defaultProps = {
  fieldText: null,
  onSelectAll: null,
};

export default SelectCheckbox;
