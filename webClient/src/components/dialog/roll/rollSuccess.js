import React from "react";
import Button from "@material-ui/core/Button";
import TodayIcon from "@material-ui/icons/Today";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import "./index.scss";

export default function RollSuccessBox(props) {
  console.log(props);
  const { coin, day, item, show, onclose } = props;

  const handleClose = () => {
    if (onclose) onclose();
  };

  return (
    <div>
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className="rollup__modal"
      >
        {props && item && (
          <>
            <DialogTitle>
              <TodayIcon /> {day}
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                <p>Coin: {coin}</p>
              </Typography>
              <Typography gutterBottom>
                <div className="rollup__modal__main">
                  <div className="rollup__modal__left">
                    <p>
                      <span>Item:</span> {item.name}
                    </p>
                    <p>
                      <span>Price:</span> {item.price}
                    </p>
                    <p>
                      <span>Description:</span> {item.description}
                    </p>
                  </div>
                  <div className="rollup__modal__right">
                    <img
                      className="rollup__modal__thumbnail"
                      src={item.thumbnail}
                      alt="roll-thumbnail"
                    />
                  </div>
                </div>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
