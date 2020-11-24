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

function ItemUpdate(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleClearError = () => {
    if (onClearError) onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, type, price } = e.target;
    if (onsubmit)
      onsubmit(
        {
          name: name.value,
          type: type.value,
          price: price.value,
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
        <DialogTitle id="form-dialog-title">Update Item</DialogTitle>
        <DialogContent>
          <DialogContentText className="MuiTypography-colorTextSecondary--error">
            {error && `* ${error}`}
          </DialogContentText>
          <DialogContentText>
            Give blank field to skip updating
          </DialogContentText>
          <form onChange={handleClearError} onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              name="type"
              defaultValue={data && data.type}
              label="Type"
              type="text"
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              name="price"
              defaultValue={data && data.price}
              label="Price"
              type="text"
              fullWidth
            />
            <Button type="submit" color="primary">
              Update
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

export default ItemUpdate;
