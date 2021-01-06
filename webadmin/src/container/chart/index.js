import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import statisticAPI from "../../api/statisticApi";
import { create2dArray } from "../../utils/array";
import Loading from "../../components/loading";
import "./index.scss";

function Chart() {
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState({
    labels: [1, 2, 3, 4, 5],
    datasets: [
      {
        label: "New Users",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "red",
        borderColor: "red",
        borderWidth: 2,
        data: [0, 0, 0, 0, 0],
      },
    ],
  });

  const [statisticOption, setStatisticOption] = useState(1); // 1:day, 2:month, 3:week

  async function getStatisticChart() {
    try {
      let res = await statisticAPI.getChart();
      if (res && res.msg === "success") {
        let statistics2d = [];
        let labels;
        if (statisticOption === 1) {
          labels = Object.keys(res.result.per_day);
          statistics2d = create2dArray(6, labels.length);

          for (let col = 0; col < labels.length; col++)
            for (let row = 0; row < 6; row++) {
              statistics2d[row][col] = res.result.per_day[labels[col]][row];
              if (row === 5) statistics2d[row][col] /= 100000;
            }
        } else if (statisticOption === 2) {
          labels = Object.keys(res.result.per_week);
          statistics2d = create2dArray(6, labels.length);

          for (let col = 0; col < labels.length; col++)
            for (let row = 0; row < 6; row++) {
              statistics2d[row][col] = res.result.per_week[labels[col]][row];
              if (row === 5) statistics2d[row][col] /= 100000;
            }
        } else {
          labels = Object.keys(res.result.per_month);
          statistics2d = create2dArray(6, labels.length);

          for (let col = 0; col < labels.length; col++)
            for (let row = 0; row < 6; row++) {
              statistics2d[row][col] = res.result.per_month[labels[col]][row];
              if (row === 5) statistics2d[row][col] /= 100000;
            }
        }

        let datasets = [];
        datasets.push(
          {
            label: "New Users",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "red",
            borderColor: "red",
            borderWidth: 2,
            data: statistics2d[0],
          },
          {
            label: "Active Users",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "plum",
            borderColor: "plum",
            borderWidth: 2,
            data: statistics2d[1],
          },
          {
            label: "Sold Items",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "blue",
            borderColor: "blue",
            borderWidth: 2,
            data: statistics2d[2],
          },
          {
            label: "Used Codes",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "#1ebfae",
            borderColor: "#1ebfae",
            borderWidth: 2,
            data: statistics2d[3],
          },
          {
            label: "Blogs",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "orange",
            borderColor: "orange",
            borderWidth: 2,
            data: statistics2d[4],
          },
          {
            label: "Cash",
            fill: false,
            lineTension: 0.5,
            backgroundColor: "green",
            borderColor: "green",
            borderWidth: 2,
            data: statistics2d[5],
          }
        );

        setChartData({
          labels,
          datasets,
        });

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStatisticChart();
  }, [statisticOption]);

  const selectStatisticOption = (option) => {
    setStatisticOption(parseInt(option.target.value));
    setLoading(true);
  };

  return (
    <div className="statistic__chart">
      <div className="statistic__chart-top">
        <h1>STATISTICS CHART</h1>
        <span>
          <span>Statistic By</span>
          <select onChange={selectStatisticOption}>
            <option value={1}>Day</option>
            <option value={2}>Week</option>
            <option value={3}>Month</option>
          </select>
        </span>
      </div>

      {!loading ? (
        <div className="statistic__chart-main">
          <p className="statistic__chart-caption">
            <i>* Cash unit: hundred thousand (100000)</i>
          </p>
          <Line
            height={"100%"}
            data={chartData}
            options={{
              title: {
                display: false,
                text: "STATISTICS CHART",
              },
              legend: {
                display: true,
                position: "right",
              },
              maintainAspectRatio: false,
            }}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default Chart;
