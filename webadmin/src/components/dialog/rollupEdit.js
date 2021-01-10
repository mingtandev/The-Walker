import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../utils/muiTheme";

function RollUpEdit(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;

  const handleCloseDialog = () => {
    if (onclose) onclose();
  };

  const handleClearError = () => {
    if (onClearError) onClearError();
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
    <ThemeProvider theme={theme}>
      <Dialog
        open={show}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update Roll</DialogTitle>
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
              name="coin"
              label="Coin"
              type="number"
              min={0}
              defaultValue={data && data.coin}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              name="item"
              label="Item ID"
              type="text"
              defaultValue={data && data.item._id}
              fullWidth
            />
            <div className="form__update__buttons">
              <Button type="submit" color="primary">
                Update
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

export default RollUpEdit;
