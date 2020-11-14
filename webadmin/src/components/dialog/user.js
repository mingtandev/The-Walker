import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function UserEdit(props) {
  const { show, onclose, data, onsubmit } = props;
  console.log(data);

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, role, cash, password } = e.target;
    console.log(name.value, role.value, cash.value, password.value);
    if (onsubmit)
      onsubmit(
        {
          name: name.value,
          roles: role.value,
          cash: cash.value,
          password: password.value,
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
      <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            // value={data.name}
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            // value={data.roles}
            name="role"
            label="Role"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            // value={data.cash}
            name="cash"
            label="Cash"
            type="number"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            name="password"
            label="Password"
            type="password"
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

export default UserEdit;
