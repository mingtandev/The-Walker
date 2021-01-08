import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import giftcodeApi from "../../api/giftcodeApi";
import "./index.scss";

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function CodeCreate() {
  const [itemsID, setItemsID] = useState([""]);
  const [errors, setErrors] = useState({ code: "", items: "", type: "" });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { code, type, expiresTime } = e.target;

    giftcodeApi
      .create({
        code: code.value,
        type: type.value,
        items: itemsID,
        expiresTime: expiresTime.value,
      })
      .then((res) => {
        if (res && res.msg === "success") {
          history.push("/giftcode");
          return;
        }
        if (res && res.msg === "ValidatorError") {
          let err = {};
          Object.keys(res.errors).forEach(
            (key) => (err[key] = `* ${res.errors[key]}`)
          );
          setErrors(err);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearErrors = () => {
    setErrors({ ...errors, code: "", type: "", items: "" });
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
    <>
      <form
        onChange={handleClearErrors}
        onSubmit={handleSubmit}
        className="giftcodes__create"
      >
        <TextField
          autoFocus
          margin="dense"
          name="code"
          label="* Code"
          helperText={errors.code}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        {/*  */}
        <InputLabel
          className="form__update__select-tag"
          htmlFor="giftcode-type"
          style={{
            textAlign: "left",
          }}
        >
          Type
        </InputLabel>
        <Select
          labelId="giftcode-type"
          name="type"
          defaultValue="Normal"
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

        {errors && <p className="giftcodes__error">{errors.items}</p>}
        <div className="giftcodes__create__item">
          <span className="giftcodes__create__item-left">Item ID(s)</span>
          <div className="giftcodes__create__item-right">
            {itemsID.map((itemid, index) => (
              <div key={index} className="giftcodes__create__item-item">
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
        <TextField
          margin="dense"
          name="expiresTime"
          label="Expire Time (ms)"
          type="number"
          style={{ marginBottom: 22 }}
          inputProps={{
            style: { fontSize: 15 },
            min: 0,
          }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
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

export default CodeCreate;
