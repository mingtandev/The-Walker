import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import giftcodeApi from "../../api/giftcodeApi";
import "./index.scss";

function CodeCreate() {
  const [errors, setErrors] = useState({ code: "", items: "", type: "" });
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { code, type, items, expiresTime } = e.target;

    giftcodeApi
      .create({
        code: code.value,
        type: type.value,
        items: items.value,
        expiresTime: expiresTime.value,
      })
      .then((res) => {
        console.log(res);
        if (res && res.msg === "success") {
          console.log("rrr", res);
          history.push("/giftcode");
          return;
        }
        if (res && res.msg === "ValidatorError") {
          setErrors({
            ...errors,
            code: res.errors.code ? "*" + res.errors.code : "",
            items: res.errors.items ? "*" + res.errors.items : "",
            type: res.errors.type ? "*" + res.errors.type : "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClearErrors = () => {
    setErrors({ ...errors, code: "", type: "", items: "" });
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
          name="code"
          label="Code"
          style={{ marginBottom: 22 }}
          helperText={errors.code}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        <TextField
          margin="dense"
          name="type"
          label="Type"
          helperText={errors.type}
          style={{ marginBottom: 22 }}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        <TextField
          margin="dense"
          name="items"
          label="Item IDs"
          helperText={errors.items}
          style={{ marginBottom: 22 }}
          FormHelperTextProps={{
            style: { color: "red", fontStyle: "italic", fontSize: 10 },
          }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
          InputLabelProps={{ style: { fontSize: 15 } }}
          fullWidth
        />
        <TextField
          margin="dense"
          name="expiresTime"
          label="Expire Time (ms)"
          type="number"
          style={{ marginBottom: 22 }}
          inputProps={{ style: { fontSize: 15 } }} // font size of input text
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
