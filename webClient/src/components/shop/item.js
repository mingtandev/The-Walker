import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import itemApi from "../../api/itemApi";

function Item({ match }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function getItem() {
      try {
        let res = await itemApi.getOne(match.params.id);
        console.log("item: ", res);
        setItem(res.item);
      } catch (error) {
        console.log(error);
      }
    }
    getItem();
  }, []);
  return (
    <div>
      {item ? (
        <div key={item._id}>
          <p>{item.price}</p>
          <p>{item.type}</p>
          <img
            src={item.thumbnail.replace(
              "localhost",
              process.env.REACT_APP_BASE_URL
            )}
            alt="item"
          />
        </div>
      ) : (
        <Redirect to="/shop" />
      )}
    </div>
  );
}

export default Item;
