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

function GiftcodeEdit(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleClearError = () => {
    if (onClearError) onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { code, type, isUsed } = e.target;
    if (onsubmit)
      onsubmit(
        {
          code: code.value,
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
              name="code"
              label="Code"
              type="text"
              defaultValue={data && data.code}
              fullWidth
            />

            <TextField
              autoFocus
              margin="dense"
              name="type"
              label="Type"
              placeholder="Normal / Vip"
              defaultValue={data && data.type}
              type="text"
              fullWidth
            />

            <InputLabel
              className="form__update__select-tag"
              htmlFor="giftcode-used"
            >
              Status
            </InputLabel>
            <Select
              labelId="user-role"
              id="giftcode-used"
              name="isUsed"
              defaultValue={data && data.isUsed}
              fullWidth
            >
              <MenuItem value="true">Used</MenuItem>
              <MenuItem value="false">Not Used</MenuItem>
            </Select>

            <div className="form__update__buttons">
              <Button type="submit" color="primary">
                Submit
              </Button>{" "}
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

export default GiftcodeEdit;
