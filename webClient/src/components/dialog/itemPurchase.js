import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function ItemPurchaseConfirm(props) {
  const { data, show, close, onPurchase } = props;

  const handleClose = () => {
    if (close) close();
  };

  const handlePurchase = () => {
    handleClose();
    if (onPurchase) onPurchase(data);
  };

  return (
    <div>
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Confirm Purchase</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePurchase} color="primary">
            PURCHASE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
