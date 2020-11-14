import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import giftcodeApi from "../../api/giftcodeApi";
import "./index.scss";

function CodeCreate() {
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
        alert("error creating giftcode");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="blogs__create">
        <TextField
          autoFocus
          margin="dense"
          name="code"
          label="Code"
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          name="type"
          label="Type"
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          name="items"
          label="Item IDs"
          type="text"
          fullWidth
        />
        <TextField
          autoFocus
          margin="dense"
          name="expiresTime"
          label="Expire Time (ms)"
          type="text"
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
