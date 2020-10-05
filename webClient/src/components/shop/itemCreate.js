import React from "react";
import itemApi from "../../api/itemApi";
import { Redirect } from "react-router-dom";

function ItemCreate() {
  const handleCreateItem = (e) => {
    e.preventDefault();
    let { name, type, price, thumbnail } = e.target;
    name = name.value;
    type = type.value;
    price = price.value;

    console.log(thumbnail.files[0]);

    if (!name.trim()) {
      alert("Lack of Item's Name");
      return;
    }

    if (!type.trim()) {
      alert("Lack of Item's Type");
      return;
    }
    if (!price.trim()) {
      alert("Lack of Item's Price");
      return;
    }

    if (!thumbnail.files[0]) {
      alert("Lack of Item's Thumbnail");
      return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("thumbnail", thumbnail.files[0]);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    itemApi
      .create(formData)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        alert("Fail in Creating Item");
        console.log(error);
      });
  };

  return (
    <>
      <form className="form" onSubmit={handleCreateItem}>
        <h1>Create A New Item</h1>
        <div className="form__input">
          <input type="text" name="name" placeholder="Name..." />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input type="text" name="type" placeholder="Type..." />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input type="text" name="price" placeholder="Price..." />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input type="file" name="thumbnail" />
        </div>
        <input type="submit" value="CREATE" />
      </form>
    </>
  );
}

export default ItemCreate;
