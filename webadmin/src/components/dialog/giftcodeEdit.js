import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
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

  const [itemsID, setItemsID] = useState([""]);

  useEffect(() => {
    if (data && data.items) {
      setItemsID(data.items);
    }
  }, [data]);

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
          items: itemsID,
          type: type.value,
          isUsed: isUsed.value,
        },
        data._id
      );
  };

  const handleChangeCodeItem = (e, index) => {
    let IDs = [...itemsID];
    IDs[index] = e.target.value;
    setItemsID(IDs);
  };

  const handleAddCodeItem = () => {
    setItemsID([...itemsID, ""]);
  };

  const handleDeleteCodeItem = (e, index) => {
    let IDs = [...itemsID];
    IDs.splice(index, 1);
    setItemsID(IDs);
  };

  return (
    <div className="form__update">
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
            <form
              className="form__update"
              onChange={handleClearError}
              onSubmit={handleSubmit}
            >
              <TextField
                autoFocus
                margin="dense"
                name="code"
                label="Code"
                type="text"
                defaultValue={data && data.code}
                fullWidth
              />
              {/*  */}
              <InputLabel
                className="form__update__select-tag"
                htmlFor="giftcode-type"
              >
                Type
              </InputLabel>
              <Select
                labelId="giftcode-type"
                name="type"
                defaultValue={data && data.type}
                fullWidth
                style={{
                  marginBottom: 20,
                  fontSize: 15,
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                <MenuItem
                  style={{
                    fontSize: 15,
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  value="Normal"
                >
                  Normal
                </MenuItem>
                <MenuItem
                  style={{
                    fontSize: 15,
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  value="Vip"
                >
                  Vip
                </MenuItem>
              </Select>
              {/*  */}

              <div className="giftcodes__edit__item">
                <span className="giftcodes__edit__item-left">Item ID(s)</span>
                <div className="giftcodes__edit__item-right">
                  {itemsID.map((itemid, index) => (
                    <div key={index} className="giftcodes__edit__item-item">
                      <TextField
                        label={`* Item ID ${index + 1}`}
                        value={itemid}
                        style={{ marginBottom: 20, width: "90%" }}
                        inputProps={{ style: { fontSize: 15 } }} // font size of input text
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        onChange={(e) => handleChangeCodeItem(e, index)}
                      />
                      <Button
                        type="button"
                        color="primary"
                        onClick={handleAddCodeItem}
                      >
                        <AddIcon fontSize="large" />
                      </Button>
                      {itemsID.length > 1 && (
                        <Button
                          type="button"
                          color="primary"
                          onClick={(e) => handleDeleteCodeItem(e, index)}
                        >
                          <DeleteIcon fontSize="large" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/*  */}
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
                style={{ marginBottom: 20 }}
                fullWidth
              >
                <MenuItem value="true">Used</MenuItem>
                <MenuItem value="false">Not Used</MenuItem>
              </Select>
              {/*  */}
              <TextField
                autoFocus
                margin="dense"
                style={{ marginBottom: 22 }}
                name="expiresTime"
                label="Expired Time (ms)"
                type="text"
                defaultValue={
                  data &&
                  new Date(data.expiresTime).getTime() - new Date().getTime() >=
                    0
                    ? parseInt(
                        (new Date(data.expiresTime).getTime() -
                          new Date().getTime()) /
                          1000
                      )
                    : 0
                }
                fullWidth
              />
              {/*  */}
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
    </div>
  );
}

export default GiftcodeEdit;
