import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toastr } from "react-redux-toastr";
import Pagination from "@material-ui/lab/Pagination";
import userApi from "../../api/userApi";
import itemApi from "../../api/itemApi";
import Item from "../../components/item";
import Loading from "../../components/loading";
import { loadUser } from "../../actions/authAction";
import ItemPurchaseConfirm from "../../components/dialog/itemPurchase";
import jwt_decode from "jwt-decode";
import "./index.scss";

function Shop() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [purchaseConfirm, setPurchaseConfirm] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    async function getItems() {
      const params = {
        page: currentPage,
        limit: 8,
      };
      try {
        let res = await itemApi.getAll(params);
        if (res && res.msg === "success") {
          setItems(res.products);
          setTotalPage(res.request.totalPages);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    getItems();
  }, [currentPage]);

  const handleConfirm = (data) => {
    if (!localStorage.getItem("token")) {
      let loginConfirm = window.confirm("Login to buy this item");
      if (!loginConfirm) return;
      history.push({
        pathname: "/sign-in",
        state: { from: window.location.pathname },
      });
      return;
    }
    setItem(data);
    setPurchaseConfirm(true);
  };

  const handleBuyItem = async (id) => {
    try {
      let itemRes = await itemApi.buyOne(id);
      let userRes = await userApi.getUserInfo(
        jwt_decode(localStorage.getItem("token"))._id
      );
      if (itemRes) {
        if (itemRes.msg === "success") {
          toastr.success("Buy Item Successfully", "Check Your Items Now");
          dispatch(loadUser(userRes.user));
        } else toastr.error(itemRes.errors.user);
        return;
      }
    } catch (error) {
      console.log(error);
      toastr.error("Cannot Afford Item", "Please Try Again");
    }
  };

  const handlePaginationChange = (e, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      {!loading ? (
        <div className="items__container">
          {items.length ? (
            items.map((item, id) => (
              <>
                <Item
                  onPurchase={() => handleConfirm(item._id)}
                  key={id}
                  {...item}
                />
              </>
            ))
          ) : (
            <div>NO ITEMS</div>
          )}
        </div>
      ) : (
        <Loading />
      )}

      {items.length && (
        <>
          <ItemPurchaseConfirm
            data={item}
            show={purchaseConfirm}
            onPurchase={handleBuyItem}
            close={() => setPurchaseConfirm(false)}
          />
          <div className="items__pagination">
            <Pagination
              count={totalPage}
              page={currentPage}
              onChange={handlePaginationChange}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </>
      )}
    </>
  );
}

export default Shop;
