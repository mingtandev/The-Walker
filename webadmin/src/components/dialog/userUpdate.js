import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../utils/muiTheme";
import "./index.scss";

function UserEdit(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;

  const handleClearError = () => {
    if (onClearError) onClearError();
  };

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
    <ThemeProvider theme={theme}>
      <Dialog
        open={show}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update User</DialogTitle>
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
              defaultValue={data && data.roles}
              name="role"
              label="admin OR user"
              type="text"
              fullWidth
            />
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="role"
              defaultValue={data && data.roles}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select> */}
            <TextField
              autoFocus
              margin="dense"
              defaultValue={data && data.cash}
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

export default UserEdit;
