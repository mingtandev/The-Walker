import React from "react";

function ItemCreate() {
  return (
    <>
      <form className="form">
        <h1>Create A New Item</h1>
        <div className="form__input">
          <input type="text" name="name" onChange={} placeholder="Name..." />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input type="text" name="type" onChange={} placeholder="Type..." />
          <span class="form__input--focus"></span>
        </div>
        <div className="form__input">
          <input type="text" name="price" onChange={} placeholder="Price..." />
          <span class="form__input--focus"></span>
        </div>
      </form>
    </>
  );
}

export default ItemCreate;
