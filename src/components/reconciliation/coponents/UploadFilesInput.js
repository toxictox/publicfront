import { Grid, Input, Stack } from '@material-ui/core';
import ButtonWithLoader from './ButtonWithLoader';

export default function UploadFilesInput(props) {
  const { file, setFieldValue, handleSubmit, setFile } = props;
  return (
    <Grid>
      <Stack direction="row" spacing={2}>
        <label htmlFor="contained-button-file">
          {!file || (
            <Input
              // accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              id="contained-button-file"
              name={'file'}
              multiple
              type="file"
              onChange={(e) => {
                setFieldValue('file', e.currentTarget.files[0]);
                handleSubmit();
                setFile(false);
              }}
              sx={{ display: 'none' }}
            />
          )}
          <ButtonWithLoader loaded={file} />
        </label>
      </Stack>
    </Grid>
  );
}
