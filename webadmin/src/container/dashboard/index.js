import React from "react";
import Statistic from "../statistic";
import Chart from "../chart";
import "./index.scss";

function DashBoard() {
  return (
    <div className="dashboard">
      <Statistic />
      <Chart />
    </div>
  );
}

export default DashBoard;
