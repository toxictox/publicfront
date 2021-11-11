import { format } from "date-fns";
const formatDate = (val) => {
  if (val !== undefined && val !== "") {
    return new Date(val).toISOString().replace(/T/, " ").replace(/\..+/, "");
  }
  return "";
};

const toLocaleDateTime = (val) => {
  return format(new Date(val), "yyyy-MM-dd  HH:mm");
};

export { formatDate, toLocaleDateTime };
