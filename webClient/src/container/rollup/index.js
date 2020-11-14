import React, { useEffect, useState } from "react";
import { toastr } from "react-redux-toastr";
import Pagination from "@material-ui/lab/Pagination";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import rollApi from "../../api/rollApi";
import "./index.scss";

function RollUp() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    async function getAllRoll() {
      console.log("thay doi", currentPage);
      try {
        const params = {
          page: currentPage,
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

  const getOneRoll = async (day) => {
    console.log(day, typeof day);
    try {
      let res = await rollApi.use(day);
      console.log(res);
      if (res) {
        if (res.msg === "success") toastr.success("Gell Roll Successfully");
        else if (res.msg === "Rollup day invalid!")
          toastr.error("Get Roll Failed!", "Rollup day invalid");
        else if (res.msg === "You has been registered today!")
          toastr.info("You has been registered today!");
        else if (res.msg.includes("Today is not"))
          toastr.warning("Get This Roll Failed!", "Rollup Day Is NOT Today");
        return;
      }
      toastr.error("Get Roll Failed! Try Login Again");
    } catch (error) {
      alert("Error getting item");
    }
  };

  const handlePaginationChange = (e, value) => {
    console.log(e, value);
    setCurrentPage(value);
  };

  return (
    <div className="rollup__container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Day</th>
            <th>Coin</th>
            <th>GET</th>
          </tr>
        </thead>
        <tbody>
          {items.length &&
            items.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{item.day}</td>
                  <td>{item.coin}</td>
                  <td>
                    <Button onClick={() => getOneRoll(item.day)}>GET</Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div className="items__pagination">
        <Pagination
          count={totalPage}
          page={currentPage}
          onChange={handlePaginationChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
}

export default RollUp;
