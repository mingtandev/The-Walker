import React, { useState } from "react";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CheckIcon from "@material-ui/icons/Check";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import itemApi from "../../api/itemApi";
import "./index.scss";

function ItemCreate() {
  const [noti, setNoti] = useState("");
  const [error, setError] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
  });

  const [details, setDetails] = useState([{ "": "" }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      type,
      price,
      description,
      sale,
      saleExpiresTime,
      thumbnail,
    } = e.target;

    let detail = {};
    details.forEach((obj) => (detail = { ...detail, ...obj }));

    let formData = new FormData();
    formData.append("name", name.value);
    formData.append("type", type.value);
    formData.append("price", price.value);
    formData.append("description", description.value);
    formData.append("details", JSON.stringify(detail));
    formData.append("sale", sale.value);
    formData.append("saleExpiresTime", saleExpiresTime.value);
    formData.append("thumbnail", thumbnail.files[0]);

    itemApi
      .create(formData)
      .then((res) => {
        if (res && res.msg === "success") {
          setNoti("Create Item Successfully");
          return;
        }
        if (res && res.msg === "ValidatorError") {
          let err = {};
          Object.keys(res.errors).forEach(
            (key) => (err[key] = `* ${res.errors[key]}`)
          );

          setError(err);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearNotify = () => {
    setNoti("");
    setError({ ...error, name: "", type: "", price: "", description: "" });
  };

  const handleChangeDetail = (e, index, prop) => {
    let oldDetailObject = details[index];
    let newDetailObject = {};
    details.splice(index, 1);

    if (prop === "key")
      newDetailObject[e.target.value] = Object.values(oldDetailObject)[0];
    //key
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
    <>
      <form
        onChange={handleClearNotify}
        onSubmit={handleSubmit}
        className="items__create"
      >
        {noti && (
          <label className="items__notification">
            <CheckIcon />
            {noti}
          </label>
        )}
        <TextField
          label="* Item Name"
          name="name"
          style={{ marginBottom: 20 }}
          helperText={error.name}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        {/*  */}
        <InputLabel
          style={{
            fontSize: 15,
            textAlign: "left",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          className="form__update__select-tag"
          htmlFor="user-role"
        >
          * Type
        </InputLabel>
        <Select
          labelId="Type"
          name="type"
          defaultValue="gun"
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
          label="* Price"
          name="price"
          type="number"
          style={{ marginBottom: 20 }}
          placeholder="Placeholder"
          helperText={error.price}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        {/*  */}
        <div className="form__details">
          <span className="form__details-left">Details</span>
          <div className="form__details-right">
            {details.map((obj, index) => (
              <div className="form__details-detail">
                <TextField
                  label="title"
                  value={Object.keys(obj)[0]}
                  style={{ marginBottom: 20, width: "90%" }}
                  inputProps={{ style: { fontSize: 15 } }} // font size of input text
                  InputLabelProps={{ style: { fontSize: 15 } }}
                  onChange={(e) => handleChangeDetail(e, index, "key")}
                />

                <TextField
                  label="content"
                  value={Object.values(obj)[0]}
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
        <TextField
          label="* Description"
          name="description"
          style={{ marginBottom: 20 }}
          helperText={error.description}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        {/*  */}
        <TextField
          label="Sale (%)"
          name="sale"
          type="number"
          min={0}
          style={{ marginBottom: 20 }}
          helperText={error.sale}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        {/*  */}
        <TextField
          label="Sale Expired Time (ms)"
          name="saleExpiresTime"
          type="number"
          min={0}
          style={{ marginBottom: 20 }}
          helperText={error.saleExpiresTime}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        {/*  */}
        <label className="blogs__label">
          Item Thumbnail (accepted: JPEG, JPG, PNG)
        </label>
        <input type="file" name="thumbnail" />{" "}
        <Button
          type="submit"
          className="blogs__submit"
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </form>
    </>
  );
}

export default ItemCreate;
