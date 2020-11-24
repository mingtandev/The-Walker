import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import itemApi from "../../api/itemApi";
import Loading from "../loading";

function Item({ match }) {
  console.log({ match });
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getItem() {
      try {
        let res = await itemApi.getOne(match.params.id);
        console.log(res);
        if (res) setItem(res.item);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getItem();
  }, []);
  return (
    <div>
      {loading === false ? (
        item ? (
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
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Item;
