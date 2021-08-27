import { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { showConfirm } from "@slices/dialog";

const AlertDialog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(
      showConfirm({
        title: "",
        isOpen: false,
        okCallback: undefined,
        text: "",
      })
    );
  };

  const dialog = useSelector((state) => state.dialog);

  return (
    <div>
      <Dialog
        open={dialog.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialog.title}</DialogTitle>
        {dialog.text !== undefined && dialog.text !== "" ? (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialog.text}
            </DialogContentText>
          </DialogContent>
        ) : null}

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t("Cancel button")}
          </Button>
          <Button onClick={dialog.okCallback} color="secondary">
            {t("Ok button")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;
