import React, { useEffect, useState } from "react";
import rollApi from "../../api/rollApi";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import "./index.scss";

function RollUp() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getAllRoll() {
      try {
        let res = await rollApi.get();
        if (res.msg === "success") setItems(res.rolls);
      } catch (error) {
        console.log("error rolling up");
      }
    }
    getAllRoll();
  }, []);

  const getOneRoll = async (day) => {
    try {
      let res = await rollApi.get(day);
      if (res.msg === "success") alert("Get Item successfully");
    } catch (error) {
      alert("Error getting item");
    }
  };

  return (
    <div className="rollup__container">
      <Table>
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
    </div>
  );
}

export default RollUp;
