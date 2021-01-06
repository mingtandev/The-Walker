import React, { useEffect, useState } from "react";
import { toastr } from "react-redux-toastr";
import Pagination from "@material-ui/lab/Pagination";
import TodayIcon from "@material-ui/icons/Today";
import Button from "@material-ui/core/Button";
import rollApi from "../../api/rollApi";
import RollSuccessBox from "../../components/dialog/roll/rollSuccess";
import "./index.scss";

function RollUp() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [rollData, setRollData] = useState(null);
  const [rollSuccessBox, setRollSuccessBox] = useState(false);

  useEffect(() => {
    async function getAllRoll() {
      try {
        const params = {
          page: currentPage,
          limit: 8,
        };
        let res = await rollApi.get(params);
        console.log(res);
        if (res.msg === "success") {
          setItems(res.rolls);
          setTotalPage(res.request.totalPages);
        }
      } catch (error) {
        console.log("error rolling up");
      }
    }
    getAllRoll();
  }, [currentPage]);

  const getOneRoll = async (item) => {
    console.log(item, typeof item);
    try {
      let res = await rollApi.use(item.day);
      console.log(res);
      if (res) {
        if (res.msg === "success") {
          setRollData(item);
          setRollSuccessBox(true);
          toastr.success("Gell Roll Successfully");
        } else if (res.msg === "ValidatorError") toastr.error(res.errors.user);
        return;
      }
      toastr.error("Get Roll Failed! Try Login Again");
    } catch (error) {
      toastr.error("Error getting item");
    }
  };

  const handlePaginationChange = (e, value) => {
    console.log(e, value);
    setCurrentPage(value);
  };

  const handleCloseRollPopUp = () => {
    setRollSuccessBox(false);
  };

  return (
    <>
      <div className="rollup__container">
        {items.length ? (
          items.map((item, id) => (
            <div className="rollup__item" key={id}>
              <div className="rollup__top">
                <TodayIcon />
                {item.day}
              </div>
              <div className="rollup__thumbnail">
                <img src={item.item.thumbnail} alt="roll-thumbnail" />
              </div>
              <div>
                <button
                  className="rollup__get"
                  type="button"
                  onClick={() => getOneRoll(item)}
                >
                  Get
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>NO ROLL-UPS</div>
        )}
      </div>

      {items.length && (
        <RollSuccessBox
          show={rollSuccessBox}
          onclose={handleCloseRollPopUp}
          {...rollData}
        />
      )}

      <div className="rollup__pagination">
        <Pagination
          count={totalPage}
          page={currentPage}
          onChange={handlePaginationChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </>
  );
}

export default RollUp;
