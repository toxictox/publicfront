import { IconButton, Input, Tooltip, makeStyles } from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/Download';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    input: {
      display: 'none',
    },
  }));

export default function UploadStatementForm(props) {
    const { bankId, onUpload } = props;
    const inputFileRef = useRef( null );
    const classes = useStyles();
    const { t } = useTranslation();

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        console.log(app);
        axios
          .post(`${app.api}/bank/${bankId}/statement`, formData)
          .then((response) => {
            toast.success(t('Success upload'));
            onUpload();
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data.message);
          });
    };

    const handleChange = (e) => {
        handleUpload(e.currentTarget.files[0]);
    };

    return (
        <form noValidate>
            <input
                type="file"
                id="contained-button-file"
                multiple
                onChange={handleChange}
                className={classes.input}
            />
            <Tooltip title="upload">
                <label htmlFor='contained-button-file'>
                    <IconButton aria-label="upload" component="span">
                        <DownloadIcon />
                    </IconButton>
                </label>
            </Tooltip>
            <Input name="bankId" type="hidden" value={bankId}></Input>
        </form>
    );
}