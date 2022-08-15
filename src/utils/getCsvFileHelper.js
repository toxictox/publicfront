export const getCsvFileHelper = ({ data, headers }) => {
  const downloadUrl = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${headers['content-disposition'].split('=')[1]}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
