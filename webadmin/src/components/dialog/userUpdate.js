import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
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
    const { name, role, cash, password, isVerified } = e.target;
    if (onsubmit)
      onsubmit(
        {
          name: name.value,
          roles: role.value,
          cash: cash.value,
          password: password.value,
          isVerified: isVerified.value,
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
              defaultValue={data && data.name}
              fullWidth
            />
            <InputLabel
              className="form__update__select-tag"
              htmlFor="user-role"
            >
              Role
            </InputLabel>
            <Select
              labelId="user-role"
              id="demo-simple-select"
              name="role"
              defaultValue={data && data.roles}
              fullWidth
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
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

            <InputLabel
              className="form__update__select-tag"
              htmlFor="user-verified"
            >
              Activate Account
            </InputLabel>
            <Select
              labelId="Activate Account"
              id="user-verified"
              name="isVerified"
              defaultValue={data && data.isVerified}
              fullWidth
            >
              <MenuItem value="true">Activate</MenuItem>
              <MenuItem value="false">Deactivate</MenuItem>
            </Select>

            <div className="form__update__buttons">
              <Button type="submit" color="primary">
                Update
              </Button>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}

export default UserEdit;
