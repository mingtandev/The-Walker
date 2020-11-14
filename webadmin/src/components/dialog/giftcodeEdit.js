import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function GiftcodeEdit(props) {
  const { show, onclose, data, onsubmit } = props;
  console.log(data);

  const handleCloseDialog = () => {
    if (onclose) onclose();
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
    <Dialog
      open={show}
      onClose={handleCloseDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Giftcode</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
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
            label="Is Used"
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
  );
}

export default GiftcodeEdit;
