const formatDate = (val) => {
  if (val !== undefined && val !== "") {
    return new Date(val).toISOString().replace(/T/, " ").replace(/\..+/, "");
  }
  return "";
};

export { formatDate };
