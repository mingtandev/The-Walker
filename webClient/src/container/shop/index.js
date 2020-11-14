import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toastr } from "react-redux-toastr";
import Pagination from "@material-ui/lab/Pagination";
import itemApi from "../../api/itemApi";
import Loading from "../../components/loading";
import Item from "../../components/item";
import userApi from "../../api/userApi";
import { loadUser } from "../../actions/authAction";
import "./index.scss";

function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getItems() {
      const params = {
        page: currentPage,
      };
      try {
        let res = await itemApi.getAll(params);
        console.log(res);
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

  const handleBuyItem = async (id) => {
    try {
      console.log(id);
      itemApi.buyOne(id).then((res) => {
        console.log("buy: ", res);
        if (res && res.msg === "success") {
          toastr.success("Buy Item Successfully", "Check Your Items Now");
          userApi
            .getUserInfo()
            .then((res) => {
              if (res.msg === "success") dispatch(loadUser(res.user));
            })
            .catch((error) => console.log(error));
        } else if (res && res.msg === "Cash not enough!")
          toastr.error("NOT ENOUGH CASH !", "Buy Item Fail");
        else toastr.warning("Cannot Afford Item", "Please Try Again");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaginationChange = (e, value) => {
    console.log(e, value);
    setCurrentPage(value);
  };

  return (
    <>
      {!loading ? (
        <div className="items__container">
          {items.length ? (
            items.map((item, id) => (
              <Item
                onPurchase={() => handleBuyItem(item._id)}
                key={id}
                {...item}
              />
            ))
          ) : (
            <div>NO ITEMS</div>
          )}
        </div>
      ) : (
        <Loading />
      )}
      <div className="items__pagination">
        <Pagination
          count={2}
          page={currentPage}
          onChange={handlePaginationChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </>
  );
}

export default Shop;
