import React, { useEffect, useState } from "react";
import itemApi from "../../api/itemApi";
import Loading from "../../components/loading";
import UserItemDetail from "../../components/userItem";
import userItemApi from "../../api/userItemApi";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./index.scss";

function UserItem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  async function getItemDetail(itemID) {
    try {
      let res = await itemApi.getOne(itemID);
      if (res && res.msg === "success") return res.item;
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserItems(userID) {
    try {
      let res = await userItemApi.getOne(userID);
      console.log(res);
      const itemsArray = [
        ...res.userItem.items.guns,
        ...res.userItem.items.hats,
        ...res.userItem.items.outfits,
      ];
      console.log(itemsArray);
      const itemsDetail = itemsArray
        .filter((obj) => {
          return obj.id !== "";
        })
        .map((obj) => {
          console.log("ne", obj.id);
          return getItemDetail(obj.id).then((item) => {
            return item;
          });
        });
      return Promise.all(itemsDetail);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/");
      return;
    }
    const userID = jwt_decode(localStorage.getItem("token"))._id;
    getUserItems(userID)
      .then((items) => setItems(items))
      .catch((error) => console.log(error));
    setLoading(false);
  }, []);

  return (
    <>
      {!loading ? (
        <div className="useritem__container">
          <h1 className="useritem__title">My Items</h1>
          <div className="useritem__main">
            {items.length ? (
              <>
                {items.map((item, id) => (
                  <UserItemDetail key={id} {...item} />
                ))}
              </>
            ) : (
              <h1 className="useritem__title">You do not affort any Items</h1>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default UserItem;
