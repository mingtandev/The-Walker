import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "../../utils/muiTheme";

function ItemUpdate(props) {
  const { show, onclose, data, error, onClearError, onsubmit } = props;

  const [details, setDetails] = useState([{ "": "" }]);

  useEffect(() => {
    if (data && data.details) {
      let detailArray = [];
      detailArray = Object.keys(data.details).map((key) => {
        return { [key]: data.details[key] };
      });
      setDetails(detailArray);
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
    const { name, type, price, thumbnail, sale, saleExpiresTime } = e.target;

    let detail = {};
    details.forEach((obj) => (detail = { ...detail, ...obj }));

    let formData = new FormData();
    formData.append("name", name.value);
    formData.append("type", type.value);
    formData.append("price", price.value);
    formData.append("details", JSON.stringify(detail));
    formData.append("sale", sale.value);
    formData.append("saleExpiresTime", saleExpiresTime.value);
    if (thumbnail.files[0]) formData.append("thumbnail", thumbnail.files[0]);

    if (onsubmit) onsubmit(formData, data._id);
  };

  const handleChangeDetail = (e, index, prop) => {
    let oldDetailObject = details[index];
    let newDetailObject = {};
    details.splice(index, 1);

    if (prop === "key")
      newDetailObject[e.target.value] = Object.values(oldDetailObject)[0];
    // key
    else newDetailObject[Object.keys(oldDetailObject)[0]] = e.target.value;

    details.splice(index, 0, newDetailObject);

    setDetails(details);
  };

  const handleAddDetail = () => {
    setDetails([...details, { "": "" }]);
  };

  const handleDeleteDetail = (e, index) => {
    let detailArray = [...details];
    detailArray.splice(index, 1);
    setDetails(detailArray);
  };

  return (
    <div className="form__update">
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
            <form onChange={handleClearError} onSubmit={handleSubmit}>
              <TextField
                autoFocus
                margin="dense"
                style={{ marginBottom: 20 }}
                name="name"
                label="Name"
                defaultValue={data && data.name}
                type="text"
                fullWidth
              />
              {/*  */}
              <Select
                labelId="Type"
                name="type"
                defaultValue={data && data.type}
                fullWidth
                style={{
                  fontSize: 15,
                  textAlign: "left",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  marginBottom: 20,
                }}
              >
                <MenuItem
                  style={{
                    fontSize: 15,
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  value="gun"
                >
                  Gun
                </MenuItem>
                <MenuItem
                  style={{
                    fontSize: 15,
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  value="hat"
                >
                  Hat
                </MenuItem>
                <MenuItem
                  style={{
                    fontSize: 15,
                    textAlign: "left",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  value="outfit"
                >
                  Outfit
                </MenuItem>
              </Select>
              {/*  */}
              <TextField
                margin="dense"
                style={{ marginBottom: 20 }}
                name="price"
                defaultValue={data && data.price}
                label="Price"
                type="text"
                fullWidth
              />
              {/*  */}

              <div className="form__update__details">
                <span className="form__update__details-left">Details</span>
                <div className="form__update__details-right">
                  {details.map((obj, index) => (
                    <div key={index} className="form__update__details-detail">
                      <TextField
                        label="title"
                        defaultValue={Object.keys(obj)[0]}
                        style={{ marginBottom: 20, width: "90%" }}
                        inputProps={{ style: { fontSize: 15 } }} // font size of input text
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        onChange={(e) => handleChangeDetail(e, index, "key")}
                      />

                      <TextField
                        label="content"
                        defaultValue={Object.values(obj)[0]}
                        style={{ marginBottom: 20, width: "90%" }}
                        inputProps={{ style: { fontSize: 15 } }} // font size of input text
                        InputLabelProps={{ style: { fontSize: 15 } }}
                        onChange={(e) => handleChangeDetail(e, index, "value")}
                      />
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleAddDetail}
                      >
                        <AddIcon fontSize="large" />
                      </Button>
                      {details.length > 1 && (
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={(e) => handleDeleteDetail(e, index)}
                        >
                          <DeleteIcon fontSize="large" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/*  */}
              <label>Item Thumbnail (accepted: JPEG, JPG, PNG)</label>
              <input type="file" name="thumbnail" />
              {/*  */}
              <TextField
                margin="dense"
                name="sale"
                defaultValue={data && data.sale}
                label="Sale (%)"
                type="number"
                inputProps={{
                  min: 0,
                }}
                fullWidth
              />
              {/*  */}
              <TextField
                margin="dense"
                name="saleExpiresTime"
                label="Sale Expired Time (ms)"
                type="number"
                defaultValue={
                  data &&
                  new Date(data.saleExpiresTime).getTime() -
                    new Date().getTime() >=
                    0
                    ? parseInt(
                        (new Date(data.saleExpiresTime).getTime() -
                          new Date().getTime()) /
                          1000
                      )
                    : 0
                }
                inputProps={{
                  min: 0,
                }}
                fullWidth
              />
              {/*  */}
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
    </div>
  );
}

export default ItemUpdate;
