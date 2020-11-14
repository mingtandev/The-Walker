import React from "react";
import { useHistory } from "react-router-dom";

import blogApi from "../../api/blogApi";
import jwt_decode from "jwt-decode";
import { Button } from "@material-ui/core";

import "./index.scss";
import rollupApi from "../../api/rollupApi";

function RollUpCreate() {
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
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
        alert("error creating roll-up");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="blogs__create">
        <div class="input-focus-effect">
          <input type="number" min={1} max={31} name="day" />
          <label>Day</label>
        </div>
        <div class="input-focus-effect">
          <input type="number" name="coin" />
          <label>Coin</label>
        </div>
        <div class="input-focus-effect">
          <input type="text" name="item" />
          <label>Item</label>
        </div>
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </>
  );
}

export default RollUpCreate;
