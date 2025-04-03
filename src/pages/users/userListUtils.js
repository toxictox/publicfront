export const processUserList = (dataList, searchEmail) => {
  if (searchEmail.trim() === '') {
    return dataList.data;
  }
  return dataList.data.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );
};
