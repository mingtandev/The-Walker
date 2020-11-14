import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function RollUpEdit(props) {
  const { show, onclose, data, onsubmit } = props;

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { coin, item } = e.target;
    if (onsubmit)
      onsubmit(
        {
          coin: coin.value,
          item: item.value,
        },
        data.day
      );
  };

  return (
    <Dialog
      open={show}
      onClose={handleCloseDialog}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Blog</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="coin"
            label="Coin"
            type="number"
            min={0}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            name="item"
            label="Item ID"
            type="text"
            fullWidth
          />
          <Button type="submit" color="primary">
            Subscribe
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

export default RollUpEdit;
