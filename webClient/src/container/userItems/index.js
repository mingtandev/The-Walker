import React, { useEffect, useState } from "react";
import Loading from "../../components/loading";
import UserItemDetail from "../../components/userItem";
import userApi from "../../api/userApi";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "./index.scss";

function UserItem() {
  const [show, setShow] = useState({ gun: true, hat: false, outfit: false });
  const [showStatus, setShowStatus] = useState(1);
  const [gunList, setGunList] = useState([]);
  const [hatList, setHatList] = useState([]);
  const [outfitList, setOutfitList] = useState([]);

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getUserItems() {
      try {
        if (!localStorage.getItem("token")) history.push("/");
        const userID = jwt_decode(localStorage.getItem("token"))._id;
        let res = await userApi.getUserInfo(userID);
        if (res && res.user) {
          setGunList(res.user.items.guns);
          setHatList(res.user.items.hats);
          setOutfitList(res.user.items.outfits);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUserItems();
  }, []);

  const handleShowItemType = (type) => {
    setShowStatus(type);
    switch (type) {
      case 1:
        setShow({ gun: true, hat: false, outfit: false });
        break;
      case 2:
        setShow({ gun: false, hat: true, outfit: false });
        break;
      case 3:
        setShow({ gun: false, hat: false, outfit: true });
        break;
      default:
        break;
    }
  };

  return (
    <>
      {!loading ? (
        <div className="useritem__container">
          <h1 className="useritem__title">My Items</h1>
          <div className="useritem__select">
            <button
              className={
                "useritem__option " +
                (showStatus === 1 ? "useritem__option--selected" : "")
              }
              onClick={() => handleShowItemType(1)}
            >
              Guns
            </button>
            <button
              className={
                "useritem__option " +
                (showStatus === 2 ? "useritem__option--selected" : "")
              }
              onClick={() => handleShowItemType(2)}
            >
              Hats
            </button>
            <button
              className={
                "useritem__option " +
                (showStatus === 3 ? "useritem__option--selected" : "")
              }
              onClick={() => handleShowItemType(3)}
            >
              Outfits
            </button>
          </div>
          <div className="useritem__main">
            {showStatus === 1 &&
              show.gun &&
              (gunList.length ? (
                <>
                  {gunList.map((item, id) => (
                    <UserItemDetail key={id} {...item} />
                  ))}
                </>
              ) : (
                <h1 className="useritem__text">You do not affort any guns</h1>
              ))}
            {/*  */}
            {showStatus === 2 &&
              show.hat &&
              (hatList.length ? (
                <>
                  {hatList.map((item, id) => (
                    <UserItemDetail key={id} {...item} />
                  ))}
                </>
              ) : (
                <h1 className="useritem__text">You do not affort any hats</h1>
              ))}
            {/*  */}
            {showStatus === 3 &&
              show.outfit &&
              (outfitList.length ? (
                <>
                  {outfitList.map((item, id) => (
                    <UserItemDetail key={id} {...item} />
                  ))}
                </>
              ) : (
                <h1 className="useritem__text">
                  You do not affort any outfits
                </h1>
              ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default UserItem;
