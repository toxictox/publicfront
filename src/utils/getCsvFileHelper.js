export const getCsvFileHelper = ({ data, headers }) => {
  const downloadUrl = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${headers['content-disposition'].split('=')[1]}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};


export const getCsvFileHelper2 = ({ data, headers }) => {
  const blob = new Blob([data], { type: headers['content-type'] });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;

  let filename = 'file.xlsx';
  const contentDisposition = headers['content-disposition'];

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);
};

