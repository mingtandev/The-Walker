import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import itemApi from "../../api/itemApi";
import "./index.scss";

function ItemCreate() {
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target);
    const { name, type, price, thumbnail } = e.target;
    console.log(thumbnail.files[0]);

    let formData = new FormData();
    formData.append("name", name.value);
    formData.append("type", type.value);
    formData.append("price", price.value);
    formData.append("thumbnail", thumbnail.files[0]);

    itemApi
      .create(formData)
      .then((res) => {
        console.log(res);
        if (res && res.msg === "success") {
          console.log(res);
          history.push("/items");
          return;
        }
        alert("error creating blog");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="blogs__create">
        <div class="input-focus-effect">
          <input type="text" name="name" />
          <label>Name</label>
        </div>
        <div class="input-focus-effect">
          <input type="text" name="type" />
          <label>Type</label>
        </div>
        <div class="input-focus-effect">
          <input type="number" name="price" />
          <label>Price</label>
        </div>
        <label className="blogs__label">
          Item Thumbnail (accepted: JPEG, JPG, PNG)
        </label>
        <input type="file" name="thumbnail" />
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
