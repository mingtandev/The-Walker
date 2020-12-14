import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import rollupApi from "../../api/rollupApi";
import "./index.scss";

function RollUpCreate() {
  const [errors, setErrors] = useState({ day: "", item: "" });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { day, coin, item } = e.target;

    rollupApi
      .create({ day: day.value, coin: coin.value, item: item.value })
      .then((res) => {
        console.log(res);
        if (res && res.msg === "success") {
          console.log("rrr", res);
          history.push("/rollup");
          return;
        }
        if (res && res.msg === "ValidatorError") {
          setErrors({
            ...errors,
            day: res.errors.day ? "*" + res.errors.day : "",
            item: res.errors.item ? "*" + res.errors.item : "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearErrors = () => {
    setErrors({ ...errors, day: "", item: "" });
  };

  return (
    <>
      <form
        onChange={handleClearErrors}
        onSubmit={handleSubmit}
        className="blogs__create"
      >
        <TextField
          autoFocus
          margin="dense"
          name="day"
          label="Day"
          type="number"
          helperText={errors.day}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          placeholder="1 - 31"
          InputProps={{
            inputProps: { min: 1, max: 31 },
            style: { fontSize: 15 },
          }}
          style={{ marginBottom: 15 }}
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        <TextField
          margin="dense"
          name="coin"
          label="Coin"
          type="number"
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          style={{ marginBottom: 15 }}
          fullWidth
        />
        <TextField
          margin="dense"
          name="item"
          label="Item ID(s)"
          helperText={errors.item}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          placeholder="id1 id2 id3 ..."
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          style={{ marginBottom: 15 }}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </>
  );
}

export default RollUpCreate;
