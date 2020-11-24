import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../utils/muiTheme";

function GiftcodeEdit(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;
  console.log(data);

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleClearError = () => {
    if (onClearError) onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { type, isUsed } = e.target;
    if (onsubmit)
      onsubmit(
        {
          type: type.value,
          isUsed: isUsed.value,
        },
        data._id
      );
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={show}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Giftcode</DialogTitle>
        <DialogContent>
          {error && (
            <DialogContentText className="MuiTypography-colorTextSecondary--error">
              {`* ${error}`}
            </DialogContentText>
          )}

          <DialogContentText>
            Give blank field to skip updating
          </DialogContentText>
          <form onChange={handleClearError} onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="type"
              label="Type"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              name="isUsed"
              label="Is Used (true/false)"
              type="text"
              fullWidth
            />
            <Button type="submit" color="primary">
              Submit
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default GiftcodeEdit;
